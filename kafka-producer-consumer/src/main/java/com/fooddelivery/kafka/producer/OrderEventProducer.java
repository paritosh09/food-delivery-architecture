package com.fooddelivery.kafka.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Kafka Producer for Order Events
 * 
 * PROBLEM: Publishing events to Kafka adds:
 * - Network latency: 10-50ms
 * - Serialization overhead: 5-10ms
 * - Failure points: Kafka can be down
 * - Complexity: Need to handle retries, idempotency
 * 
 * In a monolith: In-memory event bus, 0ms latency, no network calls
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String ORDER_CREATED_TOPIC = "order.created";
    private static final String ORDER_UPDATED_TOPIC = "order.updated";
    private static final String ORDER_CANCELLED_TOPIC = "order.cancelled";

    /**
     * Publish order created event
     * 
     * This event is consumed by:
     * - Payment Service (process payment)
     * - Notification Service (send confirmation email/SMS)
     * - Delivery Service (assign delivery driver)
     * - Audit Service (log order creation)
     * 
     * PROBLEM: If Kafka is slow or down, order creation is affected
     * In a monolith: In-memory event bus, synchronous or async handlers
     */
    public void publishOrderCreated(Long orderId, Long userId, Long restaurantId, 
                                    Double totalAmount, String status) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ORDER_CREATED");
            event.put("orderId", orderId);
            event.put("userId", userId);
            event.put("restaurantId", restaurantId);
            event.put("totalAmount", totalAmount);
            event.put("status", status);
            event.put("timestamp", System.currentTimeMillis());

            String message = objectMapper.writeValueAsString(event);
            
            CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(
                    ORDER_CREATED_TOPIC, 
                    String.valueOf(orderId), 
                    message
            );

            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Order created event published successfully for order: {}", orderId);
                } else {
                    log.error("Failed to publish order created event for order: {}", orderId, ex);
                    // PROBLEM: Event loss if Kafka is down
                    // In a monolith: Event stored in database, processed later
                }
            });
        } catch (JsonProcessingException e) {
            log.error("Error serializing order created event for order: {}", orderId, e);
            throw new RuntimeException("Failed to publish order created event", e);
        }
    }

    public void publishOrderUpdated(Long orderId, String status) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ORDER_UPDATED");
            event.put("orderId", orderId);
            event.put("status", status);
            event.put("timestamp", System.currentTimeMillis());

            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(ORDER_UPDATED_TOPIC, String.valueOf(orderId), message);
            log.info("Order updated event published for order: {}", orderId);
        } catch (JsonProcessingException e) {
            log.error("Error serializing order updated event for order: {}", orderId, e);
        }
    }

    public void publishOrderCancelled(Long orderId, Long userId) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ORDER_CANCELLED");
            event.put("orderId", orderId);
            event.put("userId", userId);
            event.put("timestamp", System.currentTimeMillis());

            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(ORDER_CANCELLED_TOPIC, String.valueOf(orderId), message);
            log.info("Order cancelled event published for order: {}", orderId);
        } catch (JsonProcessingException e) {
            log.error("Error serializing order cancelled event for order: {}", orderId, e);
        }
    }
}

