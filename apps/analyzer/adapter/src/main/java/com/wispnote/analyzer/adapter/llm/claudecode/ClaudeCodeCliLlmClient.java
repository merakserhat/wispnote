package com.wispnote.analyzer.adapter.llm.claudecode;

import com.wispnote.analyzer.adapter.common.exception.LlmCallFailedBusinessException;
import com.wispnote.analyzer.adapter.llm.LlmCall;
import com.wispnote.analyzer.adapter.llm.LlmClient;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import static java.nio.charset.StandardCharsets.UTF_8;
import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "llm.provider", havingValue = "claude-code")
public class ClaudeCodeCliLlmClient implements LlmClient {

    private static final long DRAIN_TIMEOUT_SECONDS = 5;

    private final ClaudeCodeProperties claudeCodeProperties;
    private final ResponseSchemaWriter responseSchemaWriter;
    private final JsonMapper jsonMapper;

    /**
     * Fails at boot rather than five seconds after the first note, inside a scheduled task whose exception
     * nobody sees. Catches all three ways the CLI can be unreachable: wrong name, a PATH the JVM did not
     * inherit from the shell, and a working directory that does not exist.
     */
    @PostConstruct
    void verifyCliIsReachable() {
        try {
            if (claudeCodeProperties.getWorkingDirectory() != null) {
                Files.createDirectories(claudeCodeProperties.getWorkingDirectory());
            }

            var version = run(start(List.of(claudeCodeProperties.getBinary(), "--version")), "").strip();
            log.info("The Claude Code CLI is reachable {} {}",
                    kv("binary", claudeCodeProperties.getBinary()), kv("version", version));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new LlmCallFailedBusinessException("errors.general");
        } catch (Exception e) {
            log.error("The Claude Code CLI is not reachable {} {} {}",
                    kv("binary", claudeCodeProperties.getBinary()),
                    kv("workingDirectory", claudeCodeProperties.getWorkingDirectory()),
                    kv("path", System.getenv("PATH")), e);
            throw new LlmCallFailedBusinessException("errors.general");
        }
    }

    @Override
    public <T> T complete(LlmCall call, Class<T> responseType) {
        var command = buildCommand(call, responseSchemaWriter.schemaFor(responseType));
        log.info("Calling the Claude Code CLI {} {}",
                kv("profile", call.profile()), kv("responseType", responseType.getSimpleName()));

        Process process = null;
        try {
            process = start(command);
            return parse(run(process, call.userInput()), responseType);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new LlmCallFailedBusinessException("errors.general");
        } catch (LlmCallFailedBusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("The Claude Code CLI could not be run {}", kv("binary", claudeCodeProperties.getBinary()), e);
            throw new LlmCallFailedBusinessException("errors.general");
        } finally {
            if (process != null && process.isAlive()) {
                process.destroyForcibly();
            }
        }
    }

    private String run(Process process, String userInput)
            throws InterruptedException, ExecutionException, TimeoutException {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            // Drain both pipes before writing: a response large enough to fill the buffer would otherwise
            // block the child while we are still feeding it input, and neither side would ever move.
            Future<String> stdout = executor.submit(() -> read(process.getInputStream()));
            Future<String> stderr = executor.submit(() -> read(process.getErrorStream()));

            writeInput(process, userInput);

            if (!process.waitFor(claudeCodeProperties.getTimeout().toMillis(), TimeUnit.MILLISECONDS)) {
                process.destroyForcibly();
                log.error("The Claude Code CLI timed out {}", kv("timeout", claudeCodeProperties.getTimeout()));
                throw new LlmCallFailedBusinessException("errors.general");
            }

            if (process.exitValue() != 0) {
                log.error("The Claude Code CLI failed {} {}",
                        kv("exitCode", process.exitValue()),
                        kv("stderr", stderr.get(DRAIN_TIMEOUT_SECONDS, TimeUnit.SECONDS)));
                throw new LlmCallFailedBusinessException("errors.general");
            }

            return stdout.get(DRAIN_TIMEOUT_SECONDS, TimeUnit.SECONDS);
        }
    }

    private List<String> buildCommand(LlmCall call, String schema) {
        var command = new ArrayList<String>(List.of(
                claudeCodeProperties.getBinary(),
                "-p",
                // Replace rather than append: the default prompt is a coding agent and we want a classifier.
                "--system-prompt", call.systemInstruction(),
                // -p cannot answer a permission prompt, so deny every tool instead of hanging on one.
                "--permission-mode", "dontAsk",
                "--output-format", "json",
                "--json-schema", schema));

        var model = claudeCodeProperties.getModels().get(call.profile());
        if (StringUtils.hasText(model)) {
            command.add("--model");
            command.add(model);
        }

        return command;
    }

    private Process start(List<String> command) throws IOException {
        var processBuilder = new ProcessBuilder(command);

        if (claudeCodeProperties.getWorkingDirectory() != null) {
            processBuilder.directory(claudeCodeProperties.getWorkingDirectory().toFile());
        }

        // An inherited key wins over the machine's login and would quietly bill the API account instead.
        processBuilder.environment().remove("ANTHROPIC_API_KEY");

        return processBuilder.start();
    }

    private void writeInput(Process process, String userInput) {
        try (var stdin = process.getOutputStream()) {
            stdin.write(userInput.getBytes(UTF_8));
        } catch (IOException e) {
            // A broken pipe means the child already died; its exit code is the better diagnosis, so let the
            // waitFor below report that instead of masking it with this.
            log.debug("Could not write to the Claude Code CLI, it likely exited early", e);
        }
    }

    private String read(java.io.InputStream stream) throws IOException {
        try (stream) {
            return new String(stream.readAllBytes(), UTF_8);
        }
    }

    private <T> T parse(String stdout, Class<T> responseType) {
        var envelope = jsonMapper.readTree(stdout);

        // The CLI reports its own failures on stdout as JSON rather than on stderr, so an unusable answer
        // can arrive looking like a normal response. "Not logged in" comes back this way.
        if (envelope.path("is_error").asBoolean(false)) {
            log.error("The Claude Code CLI reported an error {}", kv("result", envelope.path("result").asString()));
            throw new LlmCallFailedBusinessException("errors.general");
        }

        var structuredOutput = envelope.path("structured_output");

        if (structuredOutput.isMissingNode() || structuredOutput.isNull()) {
            log.error("The Claude Code CLI returned no structured output {}", kv("stdout", stdout));
            throw new LlmCallFailedBusinessException("errors.general");
        }

        return jsonMapper.treeToValue(structuredOutput, responseType);
    }
}
