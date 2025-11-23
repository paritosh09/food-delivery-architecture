package com.fooddelivery.order.producer;

import com.fooddelivery.order.entity.Order;
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
 * Kafka Event Producer for Order Events
 * 
 * PROBLEM: Publishing to Kafka adds latency and failure points
 * - Network call to Kafka: 10-50ms
 * - Serialization overhead: 5-10ms
 * - If Kafka is down, events are lost
 * 
 * In a monolith: In-memory event bus, 0ms latency
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
     * This event triggers:
     * - Payment Service (process payment)
     * - Notification Service (send confirmation)
     * - Delivery Service (assign delivery)
     * - Audit Service (log order)
     * 
     * PROBLEM: If Kafka is slow or down, order creation is affected
     */
    public void publishOrderCreated(Order order) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ORDER_CREATED");
            event.put("orderId", order.getId());
            event.put("userId", order.getUserId());
            event.put("restaurantId", order.getRestaurantId());
            event.put("totalAmount", order.getTotalAmount());
            event.put("status", order.getStatus().name());
            event.put("timestamp", System.currentTimeMillis());

            String message = objectMapper.writeValueAsString(event);
            
            CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(ORDER_CREATED_TOPIC, 
                    String.valueOf(order.getId()), message);

            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Order created event published successfully for order: {}", order.getId());
                } else {
                    log.error("Failed to publish order created event for order: {}", order.getId(), ex);
                }
            });
        } catch (JsonProcessingException e) {
            log.error("Error serializing order created event for order: {}", order.getId(), e);
            throw new RuntimeException("Failed to publish order created event", e);
        }
    }

    public void publishOrderUpdated(Order order) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ORDER_UPDATED");
            event.put("orderId", order.getId());
            event.put("status", order.getStatus().name());
            event.put("timestamp", System.currentTimeMillis());

            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(ORDER_UPDATED_TOPIC, String.valueOf(order.getId()), message);
            log.info("Order updated event published for order: {}", order.getId());
        } catch (JsonProcessingException e) {
            log.error("Error serializing order updated event for order: {}", order.getId(), e);
        }
    }

    public void publishOrderCancelled(Order order) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ORDER_CANCELLED");
            event.put("orderId", order.getId());
            event.put("userId", order.getUserId());
            event.put("timestamp", System.currentTimeMillis());

            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(ORDER_CANCELLED_TOPIC, String.valueOf(order.getId()), message);
            log.info("Order cancelled event published for order: {}", order.getId());
        } catch (JsonProcessingException e) {
            log.error("Error serializing order cancelled event for order: {}", order.getId(), e);
        }
    }
}

