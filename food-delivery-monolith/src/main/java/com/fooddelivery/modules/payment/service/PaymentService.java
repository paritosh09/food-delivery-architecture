package com.fooddelivery.modules.payment.service;

import com.fooddelivery.modules.order.event.OrderCreatedEvent;
import com.fooddelivery.modules.payment.entity.Payment;
import com.fooddelivery.modules.payment.event.PaymentCompletedEvent;
import com.fooddelivery.modules.payment.event.PaymentFailedEvent;
import com.fooddelivery.modules.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Async
    @EventListener
    @Transactional
    public void handleOrderCreatedEvent(OrderCreatedEvent event) {
        log.info("Processing payment for order: {}", event.getOrderId());

        Payment payment = new Payment();
        payment.setOrderId(event.getOrderId());
        payment.setUserId(event.getUserId());
        payment.setAmount(event.getTotalAmount());
        payment.setPaymentMethod("CREDIT_CARD"); // Default for now
        payment.setStatus(Payment.PaymentStatus.PENDING);
        
        paymentRepository.save(payment);

        try {
            // Simulate payment processing
            Thread.sleep(1000); // Simulate network delay
            
            // Simulate success (can add logic to fail based on amount or user)
            boolean success = true;

            if (success) {
                payment.setStatus(Payment.PaymentStatus.SUCCESS);
                payment.setTransactionId(UUID.randomUUID().toString());
                paymentRepository.save(payment);
                
                log.info("Payment successful for order: {}", event.getOrderId());
                eventPublisher.publishEvent(new PaymentCompletedEvent(event.getOrderId(), payment.getTransactionId()));
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setErrorMessage("Insufficient funds");
                paymentRepository.save(payment);
                
                log.warn("Payment failed for order: {}", event.getOrderId());
                eventPublisher.publishEvent(new PaymentFailedEvent(event.getOrderId(), "Insufficient funds"));
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Payment processing interrupted", e);
        } catch (Exception e) {
            log.error("Error processing payment", e);
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setErrorMessage(e.getMessage());
            paymentRepository.save(payment);
            eventPublisher.publishEvent(new PaymentFailedEvent(event.getOrderId(), "System error"));
        }
    }
}
