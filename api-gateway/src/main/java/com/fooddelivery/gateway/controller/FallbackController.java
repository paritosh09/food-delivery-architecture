package com.fooddelivery.gateway.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Fallback Controller
 * Handles circuit breaker fallback responses
 * 
 * PROBLEM: Fallback responses may not be appropriate for all scenarios
 * e.g., Payment cannot be cached/fallback
 */
@Slf4j
@RestController
public class FallbackController {

    @RequestMapping("/fallback/order")
    public ResponseEntity<Map<String, Object>> orderFallback() {
        log.warn("Order Service fallback triggered");
        return createFallbackResponse("Order service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping("/fallback/payment")
    public ResponseEntity<Map<String, Object>> paymentFallback() {
        log.error("Payment Service fallback triggered - CRITICAL");
        return createFallbackResponse("Payment service is temporarily unavailable. Your order may be affected.");
    }

    @RequestMapping("/fallback/menu")
    public ResponseEntity<Map<String, Object>> menuFallback() {
        log.warn("Menu Service fallback triggered");
        return createFallbackResponse("Menu service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping("/fallback/user")
    public ResponseEntity<Map<String, Object>> userFallback() {
        log.warn("User Service fallback triggered");
        return createFallbackResponse("User service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping("/fallback/cart")
    public ResponseEntity<Map<String, Object>> cartFallback() {
        log.warn("Cart Service fallback triggered");
        return createFallbackResponse("Cart service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping("/fallback/notification")
    public ResponseEntity<Map<String, Object>> notificationFallback() {
        log.warn("Notification Service fallback triggered");
        return createFallbackResponse("Notification service is temporarily unavailable.");
    }

    @RequestMapping("/fallback/delivery")
    public ResponseEntity<Map<String, Object>> deliveryFallback() {
        log.warn("Delivery Service fallback triggered");
        return createFallbackResponse("Delivery service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping("/fallback/rating")
    public ResponseEntity<Map<String, Object>> ratingFallback() {
        log.warn("Rating Service fallback triggered");
        return createFallbackResponse("Rating service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping("/fallback/invoice")
    public ResponseEntity<Map<String, Object>> invoiceFallback() {
        log.warn("Invoice Service fallback triggered");
        return createFallbackResponse("Invoice service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping("/fallback/search")
    public ResponseEntity<Map<String, Object>> searchFallback() {
        log.warn("Search Service fallback triggered");
        return createFallbackResponse("Search service is temporarily unavailable. Please try again later.");
    }

    private ResponseEntity<Map<String, Object>> createFallbackResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        response.put("error", "Service Unavailable");
        response.put("message", message);
        response.put("fallback", true);
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }
}

