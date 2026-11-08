package com.wispnote.backend.adapter.common.rabbit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
public class RabbitPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publish(String exchange, String routingKey, UUID messageId, Object message) {
        var correlation = new CorrelationData(messageId.toString());

        try {
            rabbitTemplate.convertAndSend(exchange, routingKey, message, amqpMessage -> {
                var props = amqpMessage.getMessageProperties();
                props.setMessageId(messageId.toString());
                props.setType(routingKey);
                props.setDeliveryMode(MessageDeliveryMode.PERSISTENT);
                return amqpMessage;
            }, correlation);
        } catch (AmqpException e) {
            log.error("Message publish failed {} {} {}", kv("exchange", exchange), kv("routingKey", routingKey), kv("messageId", messageId), e);
            return;
        }

        correlation.getFuture().orTimeout(5, TimeUnit.SECONDS).whenComplete((confirm, failure) -> {
            var returned = correlation.getReturned();

            if (failure != null) {
                log.error("Message not confirmed {} {} {}", kv("exchange", exchange), kv("routingKey", routingKey), kv("messageId", messageId), failure);
            } else if (returned != null) {
                log.error("Message unroutable {} {} {} {}", kv("exchange", exchange), kv("routingKey", routingKey), kv("messageId", messageId),
                        kv("replyText", returned.getReplyText()));
            } else if (!confirm.ack()) {
                log.error("Message rejected {} {} {} {}", kv("exchange", exchange), kv("routingKey", routingKey), kv("messageId", messageId),
                        kv("reason", confirm.reason()));
            }
        });
    }
}
