package com.wispnote.backend.application.common.model;

public record PaginationInfo(Integer page, Integer size, String sortBy, Boolean isAscending) {
}
