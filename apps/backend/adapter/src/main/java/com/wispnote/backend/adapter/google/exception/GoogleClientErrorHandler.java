package com.wispnote.backend.adapter.google.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResponseErrorHandler;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
public class GoogleClientErrorHandler implements ResponseErrorHandler {

    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        var statusCode = response.getStatusCode();
        return statusCode.is4xxClientError() || statusCode.is5xxServerError();
    }

    @Override
    public void handleError(URI url, HttpMethod method, ClientHttpResponse response) throws IOException {
        var body = new String(response.getBody().readAllBytes(), StandardCharsets.UTF_8);
        log.warn("A Google client error occurred. Method: {}, url: {}, status: {}, body: {}", method, url, response.getStatusCode().value(), body);
        throw new GoogleClientException("errors.googleLogin.failed");
    }
}
