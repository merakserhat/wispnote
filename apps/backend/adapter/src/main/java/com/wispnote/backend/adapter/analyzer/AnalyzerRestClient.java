package com.wispnote.backend.adapter.analyzer;

import com.wispnote.backend.adapter.analyzer.response.AnalyzerAutomationCheckRunResponse;
import com.wispnote.backend.adapter.analyzer.response.AnalyzerResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;

import java.util.List;
import java.util.UUID;

public interface AnalyzerRestClient {

    @GetExchange("/internal/v1/members/{memberId}/automation-check-runs")
    AnalyzerResponse<List<AnalyzerAutomationCheckRunResponse>> listAutomationCheckRuns(@PathVariable UUID memberId,
                                                                                       @RequestParam List<UUID> automationIds);
}
