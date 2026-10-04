package com.wispnote.backend.adapter.source.rest;

import com.wispnote.backend.adapter.auth.model.CustomUserDetails;
import com.wispnote.backend.adapter.common.rest.response.PageResponse;
import com.wispnote.backend.adapter.source.rest.request.SourceListRequest;
import com.wispnote.backend.adapter.source.rest.response.SourceResponse;
import com.wispnote.backend.application.source.SourceFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/sources")
public class SourceController {

    private final SourceFacade sourceFacade;

    @GetMapping
    public PageResponse<SourceResponse> list(@ModelAttribute @Valid SourceListRequest request,
                                             @AuthenticationPrincipal CustomUserDetails userDetail) {
        var paginated = sourceFacade.list(userDetail.getId(), request.toFilter(), request.toPaginationInfo());
        return PageResponse.from(paginated, SourceResponse::from);
    }
}
