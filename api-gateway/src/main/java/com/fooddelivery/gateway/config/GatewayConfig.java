package com.fooddelivery.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Gateway Route Configuration
 * Routes requests to 25+ microservices
 * 
 * PROBLEM: Complex routing for too many services
 * Each route adds latency and failure points
 */
@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Order Service Routes
                .route("order-service", r -> r
                        .path("/api/orders/**")
                        .filters(f -> f
                                .circuitBreaker(c -> c
                                        .setName("orderServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/order"))
                                .retry(retry -> retry
                                        .setRetries(3)
                                        .setMethods(org.springframework.http.HttpMethod.GET, 
                                                   org.springframework.http.HttpMethod.POST)
                                        .setBackoff(org.springframework.cloud.gateway.filter.factory.RetryGatewayFilterFactory.RetryConfig.BackoffConfig
                                                .builder()
                                                .firstBackoff(java.time.Duration.ofMillis(100))
                                                .maxBackoff(java.time.Duration.ofMillis(1000))
                                                .factor(2)
                                                .build()))
                                .addRequestHeader("X-Gateway-Request", "true")
                                .addResponseHeader("X-Gateway-Response", "true"))
                        .uri("lb://order-service"))

                // Payment Service Routes
                .route("payment-service", r -> r
                        .path("/api/payments/**")
                        .filters(f -> f
                                .circuitBreaker(c -> c
                                        .setName("paymentServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/payment"))
                                .addRequestHeader("X-Gateway-Request", "true"))
                        .uri("lb://payment-service"))

                // Menu Service Routes
                .route("menu-service", r -> r
                        .path("/api/menu/**")
                        .filters(f -> f
                                .circuitBreaker(c -> c
                                        .setName("menuServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/menu"))
                                .addRequestHeader("X-Gateway-Request", "true"))
                        .uri("lb://menu-service"))

                // User Service Routes
                .route("user-service", r -> r
                        .path("/api/users/**")
                        .filters(f -> f
                                .circuitBreaker(c -> c
                                        .setName("userServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/user"))
                                .addRequestHeader("X-Gateway-Request", "true"))
                        .uri("lb://user-service"))

                // Cart Service Routes
                .route("cart-service", r -> r
                        .path("/api/cart/**")
                        .filters(f -> f
                                .circuitBreaker(c -> c
                                        .setName("cartServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/cart"))
                                .addRequestHeader("X-Gateway-Request", "true"))
                        .uri("lb://cart-service"))

                // Notification Service Routes
                .route("notification-service", r -> r
                        .path("/api/notifications/**")
                        .filters(f -> f
                                .circuitBreaker(c -> c
                                        .setName("notificationServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/notification"))
                                .addRequestHeader("X-Gateway-Request", "true"))
                        .uri("lb://notification-service"))

                // Delivery Service Routes
                .route("delivery-service", r -> r
                        .path("/api/deliveries/**")
                        .filters(f -> f
                                .circuitBreaker(c -> c
                                        .setName("deliveryServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/delivery"))
                                .addRequestHeader("X-Gateway-Request", "true"))
                        .uri("lb://delivery-service"))

                // Rating Service Routes
                .route("rating-service", r -> r
                        .path("/api/ratings/**")
                        .filters(f -> f
                                .circuitBreaker(c -> c
                                        .setName("ratingServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/rating"))
                                .addRequestHeader("X-Gateway-Request", "true"))
                        .uri("lb://rating-service"))

                // Invoice Service Routes
                .route("invoice-service", r -> r
                        .path("/api/invoices/**")
                        .filters(f -> f
                                .circuitBreaker(c -> c
                                        .setName("invoiceServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/invoice"))
                                .addRequestHeader("X-Gateway-Request", "true"))
                        .uri("lb://invoice-service"))

                // Search Service Routes
                .route("search-service", r -> r
                        .path("/api/search/**")
                        .filters(f -> f
                                .circuitBreaker(c -> c
                                        .setName("searchServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/search"))
                                .addRequestHeader("X-Gateway-Request", "true"))
                        .uri("lb://search-service"))

                // ... 15+ more service routes ...
                // PROBLEM: This configuration becomes unmaintainable
                // Each service adds complexity and potential failure points

                .build();
    }
}

