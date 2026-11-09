package com.wispnote.backend.adapter.google;

import com.wispnote.backend.adapter.google.response.GoogleTokenResponse;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;

public interface GoogleTokenRestClient {

    @PostExchange(contentType = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    GoogleTokenResponse exchange(@RequestBody MultiValueMap<String, String> form);
}
