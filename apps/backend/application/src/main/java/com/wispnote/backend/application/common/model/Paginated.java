package com.wispnote.backend.application.common.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Paginated<T> {
    private Integer page;
    private Integer size;
    private Integer totalPages;
    private Integer totalElements;
    private Boolean isLastPage;
    private List<T> content;
}
