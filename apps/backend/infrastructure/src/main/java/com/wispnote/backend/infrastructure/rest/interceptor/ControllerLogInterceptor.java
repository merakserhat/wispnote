package com.wispnote.backend.infrastructure.rest.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
public class ControllerLogInterceptor implements HandlerInterceptor {

    private static final String REQUEST_START_TIME = "requestStartTime";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute(REQUEST_START_TIME, System.currentTimeMillis());
        if (handler instanceof HandlerMethod handlerMethod) {
            log.info("Starting controller method: {}.{}",
                    handlerMethod.getBeanType().getSimpleName(),
                    handlerMethod.getMethod().getName());
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        if (handler instanceof HandlerMethod handlerMethod) {
            log.info("Completed controller method: {}.{} takes {} ms",
                    handlerMethod.getBeanType().getSimpleName(),
                    handlerMethod.getMethod().getName(),
                    System.currentTimeMillis() - (Long) request.getAttribute(REQUEST_START_TIME));
        }
    }
}
