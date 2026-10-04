package com.wispnote.analyzer.adapter.backend;

import com.wispnote.analyzer.adapter.backend.response.InternalResponse;
import com.wispnote.analyzer.adapter.backend.response.NoteResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;

import java.util.UUID;

public interface BackendRestClient {

    @GetExchange("/internal/v1/notes/{noteId}")
    InternalResponse<NoteResponse> retrieveNote(@PathVariable UUID noteId);
}
