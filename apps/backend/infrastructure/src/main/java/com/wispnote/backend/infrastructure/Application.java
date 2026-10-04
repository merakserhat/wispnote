package com.wispnote.backend.infrastructure;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.wispnote.backend")
public class Application {

    public static void main(String[] args) {
        var app = new SpringApplication(Application.class);
        app.run(args);
    }
}
