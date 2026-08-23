package com.wispnote.analyzer.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
public class ScheduledConfiguration {

    @Bean
    public TaskScheduler analyzerTaskScheduler() {
        var taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.setVirtualThreads(true);
        taskScheduler.setThreadNamePrefix("analyzer-scheduler-virtual-thread");
        return taskScheduler;
    }
}