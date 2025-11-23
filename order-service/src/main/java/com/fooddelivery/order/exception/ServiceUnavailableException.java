package com.fooddelivery.order.exception;

/**
 * Custom exception for when external services are unavailable
 */
public class ServiceUnavailableException extends RuntimeException {
    private final String serviceName;

    public ServiceUnavailableException(String serviceName, String message) {
        super(message);
        this.serviceName = serviceName;
    }

    public ServiceUnavailableException(String serviceName, String message, Throwable cause) {
        super(message, cause);
        this.serviceName = serviceName;
    }

    public String getServiceName() {
        return serviceName;
    }
}

