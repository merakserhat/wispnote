package com.wispnote.analyzer.adapter.backend.exception;

import com.wispnote.analyzer.adapter.backend.response.ErrorResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResponseErrorHandler;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.net.URI;

@Slf4j
@Component
@RequiredArgsConstructor
public class BackendClientErrorHandler implements ResponseErrorHandler {

    private final JsonMapper jsonMapper;

    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        var statusCode = response.getStatusCode();
        return statusCode.is4xxClientError() || statusCode.is5xxServerError();
    }

    @Override
    public void handleError(URI url, HttpMethod method, ClientHttpResponse response) throws IOException {
        try {
            var responseBody = jsonMapper.readValue(response.getBody(), ErrorResponse.class);
            log.warn("A backend client error occurred. Status: {}, error code: {}", response.getStatusCode().value(), responseBody.errorCode());

            throw new BackendClientException(responseBody.errorMessage());
        } catch (JacksonException e) {
            log.error("An error occurred during parsing client exception", e);
            throw new BackendClientErrorMappingException("errors.general");
        }
    }
}
