package com.wispnote.backend.application.source;

import com.wispnote.backend.application.common.model.Paginated;
import com.wispnote.backend.application.common.model.PaginationInfo;
import com.wispnote.backend.application.source.model.SourceFilter;
import com.wispnote.backend.application.source.model.SourceSummary;
import com.wispnote.backend.application.source.port.SourcePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SourceFacade {

    private final SourcePort sourcePort;

    public Paginated<SourceSummary> list(UUID memberId, SourceFilter filter, PaginationInfo paginationInfo) {
        return sourcePort.findAllByMemberId(memberId, filter, paginationInfo);
    }
}
