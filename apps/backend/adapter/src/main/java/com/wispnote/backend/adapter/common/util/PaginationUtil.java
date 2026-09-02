package com.wispnote.backend.adapter.common.util;

import com.wispnote.backend.application.common.model.Paginated;
import com.wispnote.backend.application.common.model.PaginationInfo;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import static lombok.AccessLevel.PRIVATE;
import static org.springframework.data.domain.Sort.Direction.ASC;
import static org.springframework.data.domain.Sort.Direction.DESC;

@NoArgsConstructor(access = PRIVATE)
public class PaginationUtil {

    public static Pageable fromPaginationInfo(PaginationInfo paginationInfo) {
        var sort = Sort.by(paginationInfo.isAscending() ? ASC : DESC, paginationInfo.sortBy());

        return PageRequest.of(paginationInfo.page(), paginationInfo.size(), sort);
    }

    public static <T> Paginated<T> fromPage(Page<T> page) {
        var paginated = new Paginated<T>();
        paginated.setPage(page.getNumber());
        paginated.setSize(page.getSize());
        paginated.setTotalPages(page.getTotalPages());
        paginated.setTotalElements((int) page.getTotalElements());
        paginated.setIsLastPage(page.isLast());
        paginated.setContent(page.getContent());

        return paginated;
    }
}
