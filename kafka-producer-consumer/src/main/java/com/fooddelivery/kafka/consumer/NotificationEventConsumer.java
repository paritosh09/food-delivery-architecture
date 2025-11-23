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
 * Notification Service Consumer
 * Consumes payment.processed events and sends notifications
 * 
 * PROBLEM: Event chain: order.created → payment.processed → notification.send
 * If any step fails, chain breaks
 * Difficult to debug event flow across services
 * 
 * In a monolith: Direct method calls or in-memory events
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventConsumer {

    private final ObjectMapper objectMapper;
    // private final NotificationService notificationService;

    /**
     * Consume payment.processed events
     * Send notification to user about payment success/failure
     */
    @KafkaListener(
            topics = "payment.processed",
            groupId = "notification-service-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handlePaymentProcessed(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_KEY) String key,
            Acknowledgment acknowledgment) {
        
        try {
            log.info("Received payment.processed event: key={}", key);
            
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            Long orderId = Long.valueOf(event.get("orderId").toString());
            Long userId = Long.valueOf(event.get("userId").toString());
            String paymentStatus = event.get("status").toString();

            log.info("Sending notification for order: {}, user: {}, payment status: {}", 
                    orderId, userId, paymentStatus);

            // Send notification
            sendNotification(userId, orderId, paymentStatus);

            acknowledgment.acknowledge();
            log.info("Notification sent successfully for order: {}", orderId);

        } catch (Exception e) {
            log.error("Error processing payment.processed event: {}", message, e);
            // PROBLEM: Notification failure doesn't affect order, but user doesn't get notified
        }
    }

    /**
     * Consume order.created events
     * Send order confirmation notification
     */
    @KafkaListener(
            topics = "order.created",
            groupId = "notification-service-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleOrderCreated(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_KEY) String key,
            Acknowledgment acknowledgment) {
        
        try {
            log.info("Received order.created event for notification: key={}", key);
            
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            Long orderId = Long.valueOf(event.get("orderId").toString());
            Long userId = Long.valueOf(event.get("userId").toString());

            log.info("Sending order confirmation notification for order: {}, user: {}", orderId, userId);

            // Send order confirmation
            sendOrderConfirmation(userId, orderId);

            acknowledgment.acknowledge();

        } catch (Exception e) {
            log.error("Error processing order.created event for notification: {}", message, e);
        }
    }

    private void sendNotification(Long userId, Long orderId, String paymentStatus) {
        // TODO: Implement actual notification sending (email, SMS, push)
        log.info("Sending notification to user {} for order {}: payment status={}", 
                userId, orderId, paymentStatus);
        
        // PROBLEM: If notification service is down, notifications are lost
        // In a monolith: Could store in database and retry
    }

    private void sendOrderConfirmation(Long userId, Long orderId) {
        // TODO: Implement order confirmation notification
        log.info("Sending order confirmation to user {} for order {}", userId, orderId);
    }
}

