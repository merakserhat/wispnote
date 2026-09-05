package com.wispnote.backend.adapter.automation.rest;

import com.wispnote.backend.adapter.auth.model.CustomUserDetails;
import com.wispnote.backend.adapter.automation.rest.request.AutomationCreateRequest;
import com.wispnote.backend.adapter.automation.rest.request.AutomationListRequest;
import com.wispnote.backend.adapter.automation.rest.request.AutomationToggleRequest;
import com.wispnote.backend.adapter.automation.rest.request.AutomationUpdateRequest;
import com.wispnote.backend.adapter.automation.rest.response.AutomationPageResponse;
import com.wispnote.backend.adapter.automation.rest.response.AutomationResponse;
import com.wispnote.backend.adapter.automation.rest.response.AutomationSuggestionResponse;
import com.wispnote.backend.application.automation.AutomationFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/automations")
public class AutomationController {

    private final AutomationFacade automationFacade;

    @PostMapping
    public AutomationResponse create(@RequestBody @Valid AutomationCreateRequest request,
                                     @AuthenticationPrincipal CustomUserDetails userDetail) {
        var automation = automationFacade.create(userDetail.getId(), request.toModel());
        return AutomationResponse.from(automation);
    }

    @GetMapping
    public AutomationPageResponse list(@ModelAttribute @Valid AutomationListRequest request,
                                       @AuthenticationPrincipal CustomUserDetails userDetail) {
        var automationPage = automationFacade.list(userDetail.getId(), request.toFilter(), request.toPaginationInfo());
        return AutomationPageResponse.from(automationPage);
    }

    @GetMapping("/suggestions")
    public List<AutomationSuggestionResponse> suggestions(@AuthenticationPrincipal CustomUserDetails userDetail) {
        return automationFacade.suggestions(userDetail.getId()).stream()
                .map(AutomationSuggestionResponse::from)
                .toList();
    }

    @GetMapping("/{automationId}")
    public AutomationResponse retrieve(@PathVariable UUID automationId,
                                       @AuthenticationPrincipal CustomUserDetails userDetail) {
        var automation = automationFacade.retrieve(userDetail.getId(), automationId);
        return AutomationResponse.from(automation);
    }

    @PutMapping("/{automationId}")
    public AutomationResponse update(@PathVariable UUID automationId,
                                     @RequestBody @Valid AutomationUpdateRequest request,
                                     @AuthenticationPrincipal CustomUserDetails userDetail) {
        var automation = automationFacade.update(userDetail.getId(), automationId, request.toModel());
        return AutomationResponse.from(automation);
    }

    @PatchMapping("/{automationId}")
    public AutomationResponse toggle(@PathVariable UUID automationId,
                                     @RequestBody @Valid AutomationToggleRequest request,
                                     @AuthenticationPrincipal CustomUserDetails userDetail) {
        var automation = automationFacade.update(userDetail.getId(), automationId, request.toModel());
        return AutomationResponse.from(automation);
    }

    @DeleteMapping("/{automationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID automationId,
                       @AuthenticationPrincipal CustomUserDetails userDetail) {
        automationFacade.delete(userDetail.getId(), automationId);
    }
}
