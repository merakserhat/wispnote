package com.wispnote.analyzer.adapter.backend;

import com.wispnote.analyzer.adapter.backend.response.AutomationResponse;
import com.wispnote.analyzer.adapter.backend.response.InternalResponse;
import com.wispnote.analyzer.adapter.backend.response.NoteGroupResponse;
import com.wispnote.analyzer.adapter.backend.response.NoteResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;

import java.util.List;
import java.util.UUID;

public interface BackendRestClient {

    @GetExchange("/internal/v1/members/{memberId}/notes/{noteId}")
    InternalResponse<NoteResponse> retrieveNote(@PathVariable UUID memberId, @PathVariable UUID noteId);

    @GetExchange("/internal/v1/members/{memberId}/automations/{automationId}")
    InternalResponse<AutomationResponse> retrieveAutomation(@PathVariable UUID memberId, @PathVariable UUID automationId);

    @GetExchange("/internal/v1/members/{memberId}/note-groups")
    InternalResponse<List<NoteGroupResponse>> listNoteGroups(@PathVariable UUID memberId);
}
