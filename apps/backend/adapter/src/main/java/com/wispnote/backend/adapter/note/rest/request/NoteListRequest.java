package com.wispnote.backend.adapter.note.rest.request;

import com.wispnote.backend.application.common.model.PaginationInfo;
import com.wispnote.backend.application.note.enums.NoteKind;
import com.wispnote.backend.application.note.model.NoteFilter;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class NoteListRequest {

    private static final Set<String> SORTABLE_FIELDS = Set.of("createdAt", "updatedAt", "pageNumber");
    private static final String DEFAULT_SORT_FIELD = "createdAt";

    @NotNull(message = "{validations.pageRequest.page.empty}")
    @Min(value = 0, message = "{validations.pageRequest.page.min}")
    private Integer page;

    @NotNull(message = "{validations.pageRequest.size.empty}")
    @Min(value = 1, message = "{validations.pageRequest.size.min}")
    @Max(value = 200, message = "{validations.pageRequest.size.max}")
    private Integer size;

    private String sortBy;
    private Boolean isAscending;

    private UUID sourceId;
    private UUID noteGroupId;
    private NoteKind kind;
    private String search;

    public PaginationInfo toPaginationInfo() {
        var sortField = sortBy != null && SORTABLE_FIELDS.contains(sortBy) ? sortBy : DEFAULT_SORT_FIELD;

        return new PaginationInfo(page, size, sortField, isAscending != null && isAscending);
    }

    public NoteFilter toFilter() {
        return new NoteFilter(sourceId, noteGroupId, kind, search);
    }
}
