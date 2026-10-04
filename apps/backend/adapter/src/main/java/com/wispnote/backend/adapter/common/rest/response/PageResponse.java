package com.wispnote.backend.adapter.common.rest.response;

import com.wispnote.backend.application.common.model.Paginated;

import java.util.List;
import java.util.function.Function;

public record PageResponse<T>(Integer page,
                              Integer size,
                              Integer totalPages,
                              Integer totalElements,
                              Boolean isLastPage,
                              List<T> content) {

    public static <M, T> PageResponse<T> from(Paginated<M> paginated, Function<M, T> mapper) {
        return new PageResponse<>(paginated.getPage(),
                paginated.getSize(),
                paginated.getTotalPages(),
                paginated.getTotalElements(),
                paginated.getIsLastPage(),
                paginated.getContent().stream().map(mapper).toList());
    }
}
