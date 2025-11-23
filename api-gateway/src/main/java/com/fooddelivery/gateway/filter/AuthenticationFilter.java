package com.fooddelivery.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Authentication Filter
 * Validates JWT tokens for all requests
 * 
 * PROBLEM: Single point of authentication
 * If this fails, all services are inaccessible
 */
@Slf4j
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        // Skip auth for public endpoints
        String path = request.getURI().getPath();
        if (path.startsWith("/api/public/") || path.startsWith("/actuator/")) {
            return chain.filter(exchange);
        }

        String authHeader = request.getHeaders().getFirst("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Unauthorized request to: {}", path);
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }

        // Extract and validate token
        String token = authHeader.substring(7);
        if (!isValidToken(token)) {
            log.warn("Invalid token for request to: {}", path);
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }

        // Add user info to headers for downstream services
        ServerHttpRequest modifiedRequest = request.mutate()
                .header("X-User-Id", extractUserId(token))
                .header("X-User-Role", extractUserRole(token))
                .build();

        return chain.filter(exchange.mutate().request(modifiedRequest).build());
    }

    private boolean isValidToken(String token) {
        // TODO: Implement actual JWT validation
        // This would typically call a User Service or validate locally
        return token != null && !token.isEmpty();
    }

    private String extractUserId(String token) {
        // TODO: Extract from JWT claims
        return "user-123";
    }

    private String extractUserRole(String token) {
        // TODO: Extract from JWT claims
        return "CUSTOMER";
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 1;
    }
}

