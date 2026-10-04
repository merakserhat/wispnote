package com.wispnote.backend.adapter.source.rest.request;

import com.wispnote.backend.application.common.model.PaginationInfo;
import com.wispnote.backend.application.source.enums.SourceKind;
import com.wispnote.backend.application.source.model.SourceFilter;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class SourceListRequest {

    private static final Set<String> SORTABLE_FIELDS = Set.of("lastActivityAt", "title", "noteCount");
    private static final String DEFAULT_SORT_FIELD = "lastActivityAt";

    @NotNull(message = "{validations.pageRequest.page.empty}")
    @Min(value = 0, message = "{validations.pageRequest.page.min}")
    private Integer page;

    @NotNull(message = "{validations.pageRequest.size.empty}")
    @Min(value = 1, message = "{validations.pageRequest.size.min}")
    @Max(value = 200, message = "{validations.pageRequest.size.max}")
    private Integer size;

    private String sortBy;
    private Boolean isAscending;

    private SourceKind kind;

    public PaginationInfo toPaginationInfo() {
        var sortField = sortBy != null && SORTABLE_FIELDS.contains(sortBy) ? sortBy : DEFAULT_SORT_FIELD;

        return new PaginationInfo(page, size, sortField, isAscending != null && isAscending);
    }

    public SourceFilter toFilter() {
        return new SourceFilter(kind);
    }
}
