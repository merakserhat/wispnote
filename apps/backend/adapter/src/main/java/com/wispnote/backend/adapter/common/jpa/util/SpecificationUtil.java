package com.wispnote.backend.adapter.common.jpa.util;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.util.Collection;
import java.util.UUID;

public class SpecificationUtil {

    public static Predicate like(CriteriaBuilder builder, Expression<String> fieldName, String searchValue) {
        if (StringUtils.isBlank(searchValue)) {
            return builder.conjunction();
        }
        return builder.like(builder.lower(fieldName), "%" + searchValue.toLowerCase() + "%");
    }

    public static <T> Predicate in(CriteriaBuilder builder, Expression<String> fieldName, Collection<T> values) {
        if (CollectionUtils.isEmpty(values)) {
            return builder.conjunction();
        }
        return fieldName.in(values);
    }

    public static Predicate uuidEqual(CriteriaBuilder builder, Expression<String> fieldName, UUID uuid) {
        if (uuid == null) {
            return builder.conjunction();
        }
        return builder.equal(fieldName, uuid);
    }

    public static <T> Predicate equal(CriteriaBuilder builder, Expression<String> fieldName, T value) {
        if (value == null) {
            return builder.conjunction();
        }
        return builder.equal(fieldName, value);
    }

    public static <T> Predicate notEqual(CriteriaBuilder builder, Expression<String> fieldName, T value) {
        if (value == null) {
            return builder.conjunction();
        }
        return builder.notEqual(fieldName, value);
    }

    public static Boolean isCountRecordsQuery(CriteriaQuery<?> criteriaQuery) {
        return Long.class == criteriaQuery.getResultType();
    }
}
