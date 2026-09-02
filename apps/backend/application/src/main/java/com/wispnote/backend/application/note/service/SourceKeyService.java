package com.wispnote.backend.application.note.service;

import com.wispnote.backend.application.note.exception.SourceKeyNotResolvableValidationException;
import com.wispnote.backend.application.note.model.SourceCapture;
import lombok.NoArgsConstructor;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class SourceKeyService {

    private static final Set<String> TRACKING_PARAMS = Set.of(
            "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
            "fbclid", "gclid", "ref", "ref_src");

    private static final int NO_PORT = -1;

    public static String resolve(SourceCapture capture) {
        if (capture == null || capture.kind() == null) {
            throw new SourceKeyNotResolvableValidationException();
        }

        return switch (capture.kind()) {
            case WEB -> normalizeUrl(required(capture.url()));
            case PDF, FILE -> normalizePath(required(capture.filePath()));
            case MAIL -> required(capture.documentId());
            case APP -> required(capture.bundleId()) + ":" + required(capture.documentId());
        };
    }

    private static String normalizeUrl(String url) {
        var uri = toUri(url.trim());

        if (uri.getScheme() == null || uri.getHost() == null) {
            throw new SourceKeyNotResolvableValidationException();
        }

        var scheme = uri.getScheme().toLowerCase(Locale.ROOT);
        var host = uri.getHost().toLowerCase(Locale.ROOT);
        var port = isDefaultPort(scheme, uri.getPort()) ? "" : ":" + uri.getPort();
        var path = stripTrailingSlash(uri.getPath() == null ? "" : uri.getPath());

        return scheme + "://" + host + port + path + significantQuery(uri.getRawQuery());
    }

    private static String normalizePath(String filePath) {
        return Paths.get(filePath.trim()).normalize().toString();
    }

    private static URI toUri(String url) {
        try {
            return new URI(url);
        } catch (URISyntaxException e) {
            throw new SourceKeyNotResolvableValidationException();
        }
    }

    private static boolean isDefaultPort(String scheme, int port) {
        return port == NO_PORT
                || ("http".equals(scheme) && port == 80)
                || ("https".equals(scheme) && port == 443);
    }

    private static String stripTrailingSlash(String path) {
        return path.endsWith("/") ? path.substring(0, path.length() - 1) : path;
    }

    private static String significantQuery(String rawQuery) {
        if (rawQuery == null || rawQuery.isBlank()) {
            return "";
        }

        var significant = Arrays.stream(rawQuery.split("&"))
                .filter(param -> !param.isBlank())
                .filter(param -> !TRACKING_PARAMS.contains(nameOf(param)))
                .sorted()
                .collect(Collectors.joining("&"));

        return significant.isEmpty() ? "" : "?" + significant;
    }

    private static String nameOf(String param) {
        var separator = param.indexOf('=');
        return separator < 0 ? param : param.substring(0, separator);
    }

    private static String required(String value) {
        if (value == null || value.isBlank()) {
            throw new SourceKeyNotResolvableValidationException();
        }
        return value;
    }
}
