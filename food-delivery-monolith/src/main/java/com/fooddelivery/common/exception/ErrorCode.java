package com.fooddelivery.common.exception;

public enum ErrorCode {
    // 400 Bad Request
    INVALID_REQUEST("INVALID_REQUEST", "Invalid request parameters"),
    VALIDATION_FAILED("VALIDATION_FAILED", "Request validation failed"),
    CONSTRAINT_VIOLATION("CONSTRAINT_VIOLATION", "Constraint violation"),
    TYPE_MISMATCH("TYPE_MISMATCH", "Invalid parameter type"),
    MALFORMED_REQUEST("MALFORMED_REQUEST", "Malformed request body"),
    ILLEGAL_ARGUMENT("ILLEGAL_ARGUMENT", "Illegal argument provided"),
    ORDER_VALIDATION_FAILED("ORDER_VALIDATION_FAILED", "Order validation failed"),
    
    // 404 Not Found
    ORDER_NOT_FOUND("ORDER_NOT_FOUND", "Order not found"),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "Resource not found"),
    
    // 409 Conflict
    DATA_INTEGRITY_VIOLATION("DATA_INTEGRITY_VIOLATION", "Data integrity violation"),
    
    // 424 Failed Dependency
    PAYMENT_PROCESSING_FAILED("PAYMENT_PROCESSING_FAILED", "Payment processing failed"),
    
    // 500 Internal Server Error
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "Internal server error"),
    DATABASE_ERROR("DATABASE_ERROR", "Database operation failed"),
    RUNTIME_ERROR("RUNTIME_ERROR", "Unexpected runtime error"),
    
    // 502 Bad Gateway
    BAD_GATEWAY("BAD_GATEWAY", "Bad gateway error"),
    
    // 503 Service Unavailable
    SERVICE_UNAVAILABLE("SERVICE_UNAVAILABLE", "Service temporarily unavailable"),
    PAYMENT_SERVICE_UNAVAILABLE("PAYMENT_SERVICE_UNAVAILABLE", "Payment service unavailable"),
    MENU_SERVICE_UNAVAILABLE("MENU_SERVICE_UNAVAILABLE", "Menu service unavailable"),
    
    // 504 Gateway Timeout
    GATEWAY_TIMEOUT("GATEWAY_TIMEOUT", "Gateway timeout");

    private final String code;
    private final String defaultMessage;

    ErrorCode(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

    public String getCode() {
        return code;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}
