package com.wispnote.analyzer.adapter.common.event.pubsub.request;

import java.util.Base64;
import java.util.Map;

public record PubSubPushMessage(String data,
                                Map<String, String> attributes,
                                String messageId,
                                String publishTime) {

    public byte[] decodedData() {
        return Base64.getDecoder().decode(data);
    }
}
