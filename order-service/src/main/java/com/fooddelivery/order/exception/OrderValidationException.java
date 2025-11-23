package com.fooddelivery.order.exception;

import java.util.List;

/**
 * Custom exception for order validation errors
 */
public class OrderValidationException extends RuntimeException {
    private final List<String> validationErrors;

    public OrderValidationException(String message) {
        super(message);
        this.validationErrors = List.of(message);
    }

    public OrderValidationException(String message, List<String> validationErrors) {
        super(message);
        this.validationErrors = validationErrors;
    }

    public List<String> getValidationErrors() {
        return validationErrors;
    }
}

