package com.wispnote.backend.adapter.google.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GoogleTokenResponse(@JsonProperty("id_token") String idToken) {
}
