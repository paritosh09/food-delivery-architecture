package com.fooddelivery.kafka.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Payment Service Consumer
 * Consumes order.created events and processes payment
 * 
 * PROBLEM: Event-driven architecture adds complexity:
 * - Event ordering issues
 * - Duplicate event handling
 * - Event schema evolution
 * - Debugging distributed event flows
 * 
 * In a monolith: Direct method call or in-memory event bus
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final ObjectMapper objectMapper;
    // private final PaymentService paymentService; // Would inject actual service

    /**
     * Consume order.created events
     * 
     * PROBLEM: This is async - payment processing happens after order creation
     * If payment fails, order is already created
     * Need to handle rollback or compensation
     * 
     * In a monolith: Could be synchronous transaction
     */
    @KafkaListener(
            topics = "order.created",
            groupId = "payment-service-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleOrderCreated(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_KEY) String key,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment acknowledgment) {
        
        try {
            log.info("Received order.created event: key={}, partition={}, offset={}", key, partition, offset);
            
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            Long orderId = Long.valueOf(event.get("orderId").toString());
            Long userId = Long.valueOf(event.get("userId").toString());
            Double totalAmount = Double.valueOf(event.get("totalAmount").toString());

            log.info("Processing payment for order: {}, user: {}, amount: {}", orderId, userId, totalAmount);

            // Process payment
            // PROBLEM: This is async - order already created
            // If payment fails, need compensation logic
            processPayment(orderId, userId, totalAmount);

            // Acknowledge message
            acknowledgment.acknowledge();
            log.info("Payment processed successfully for order: {}", orderId);

        } catch (IllegalArgumentException e) {
            log.error("Invalid event data: {}", message, e);
            // Acknowledge to skip invalid messages
            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("Error processing order.created event: {}", message, e);
            // PROBLEM: If we don't acknowledge, message will be retried
            // But if payment keeps failing, we get infinite retries
            // Need dead letter queue handling
            
            // For now, acknowledge after max retries to prevent infinite loop
            // In production, implement dead letter queue
            acknowledgment.acknowledge();
        }
    }

    private void processPayment(Long orderId, Long userId, Double amount) {
        // TODO: Implement actual payment processing
        // This would call external payment gateway
        log.info("Processing payment for order {}: amount={}", orderId, amount);
        
        // PROBLEM: If this fails, order is already created
        // Need to handle compensation (cancel order, refund, etc.)
    }
}

