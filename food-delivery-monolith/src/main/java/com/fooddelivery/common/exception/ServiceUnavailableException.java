package com.fooddelivery.common.exception;

import lombok.Getter;

@Getter
public class ServiceUnavailableException extends RuntimeException {
    private final String serviceName;

    public ServiceUnavailableException(String serviceName, String message) {
        super(message);
        this.serviceName = serviceName;
    }
}
