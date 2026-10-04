package com.wispnote.backend.adapter.common.rest.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class BaseResponse<T> {
    private T result;

    public BaseResponse(T result) {
        this.result = result;
    }
}
