package com.wispnote.backend.adapter.common.rest.config;

import com.wispnote.backend.adapter.common.rest.response.BaseResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * Wraps every successful controller response body in a {@link BaseResponse} envelope,
 * so clients always read the payload from the "result" field.
 */
@ControllerAdvice(basePackages = "com.wispnote.backend.adapter")
public class ResponseWrapperConfiguration implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {

        if (body instanceof BaseResponse<?>) {
            return body;
        }

        if (response instanceof ServletServerHttpResponse servletResponse) {
            var statusCode = servletResponse.getServletResponse().getStatus();
            var is2xxResponse = HttpStatus.valueOf(statusCode).is2xxSuccessful();

            if (is2xxResponse) {
                return new BaseResponse<>(body);
            }
        }

        return body;
    }
}
