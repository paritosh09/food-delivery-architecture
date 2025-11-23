package com.fooddelivery.order.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Standard error response DTO
 * Follows RFC 7807 Problem Details for HTTP APIs
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private String traceId; // For distributed tracing
    private List<String> validationErrors; // For validation errors
    private Map<String, Object> details; // Additional error details
    private String errorCode; // Application-specific error code
}

