package com.wispnote.analyzer.adapter.common.event.pubsub.request;

public record PubSubPushRequest(PubSubPushMessage message,
                                String subscription,
                                Integer deliveryAttempt) {
}
