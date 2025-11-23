package com.fooddelivery.order.client;

import com.fooddelivery.order.dto.PaymentRequest;
import com.fooddelivery.order.dto.PaymentResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.concurrent.CompletableFuture;

/**
 * Feign Client for Payment Service
 * 
 * PROBLEM: This is a synchronous HTTP call that could be:
 * 1. Direct method call in a monolith (0ms latency)
 * 2. In-process call (no network overhead)
 * 
 * Current: HTTP call + Circuit Breaker + Retry + Timeout = 200-500ms
 * Monolith: Direct method call = <1ms
 */
@FeignClient(name = "payment-service", path = "/api/payments")
public interface PaymentServiceClient {

    /**
     * Process payment for an order
     * 
     * Circuit Breaker: Opens after 5 failures in 10 seconds
     * Retry: 3 attempts with exponential backoff
     * Timeout: 5 seconds
     * 
     * PROBLEM: If Payment Service is slow, this blocks Order Service
     * In a monolith, this would be a simple method call
     */
    @PostMapping("/process")
    @CircuitBreaker(name = "paymentService", fallbackMethod = "fallbackPayment")
    @Retry(name = "paymentService")
    @TimeLimiter(name = "paymentService")
    CompletableFuture<PaymentResponse> processPayment(@RequestBody PaymentRequest request);

    /**
     * Fallback method when Payment Service is unavailable
     * 
     * PROBLEM: Payment cannot be cached or skipped
     * Fallback creates inconsistent state
     */
    default CompletableFuture<PaymentResponse> fallbackPayment(PaymentRequest request, Throwable ex) {
        PaymentResponse fallback = new PaymentResponse();
        fallback.setStatus("FAILED");
        fallback.setMessage("Payment service is temporarily unavailable. Please try again later.");
        return CompletableFuture.completedFuture(fallback);
    }
}

