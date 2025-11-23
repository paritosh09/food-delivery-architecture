package com.fooddelivery.order.exception;

import com.fooddelivery.order.dto.ErrorResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Global Exception Handler for Order Service
 * Handles all exceptions and returns standardized error responses
 * 
 * Best Practices:
 * - Centralized exception handling
 * - Consistent error response format
 * - Proper HTTP status codes
 * - Detailed logging for debugging
 * - User-friendly error messages
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle OrderNotFoundException
     * HTTP Status: 404 NOT FOUND
     */
    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleOrderNotFound(
            OrderNotFoundException ex, WebRequest request) {
        log.warn("Order not found: {}", ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .message(ex.getMessage() != null ? ex.getMessage() : ErrorCode.ORDER_NOT_FOUND.getDefaultMessage())
                .path(getPath(request))
                .errorCode(ErrorCode.ORDER_NOT_FOUND.getCode())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handle OrderValidationException
     * HTTP Status: 400 BAD REQUEST
     */
    @ExceptionHandler(OrderValidationException.class)
    public ResponseEntity<ErrorResponse> handleOrderValidation(
            OrderValidationException ex, WebRequest request) {
        log.warn("Order validation failed: {}", ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ex.getMessage() != null ? ex.getMessage() : ErrorCode.ORDER_VALIDATION_FAILED.getDefaultMessage())
                .path(getPath(request))
                .validationErrors(ex.getValidationErrors())
                .errorCode(ErrorCode.ORDER_VALIDATION_FAILED.getCode())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handle PaymentProcessingException
     * HTTP Status: 424 FAILED DEPENDENCY (payment is a dependency that failed)
     */
    @ExceptionHandler(PaymentProcessingException.class)
    public ResponseEntity<ErrorResponse> handlePaymentProcessing(
            PaymentProcessingException ex, WebRequest request) {
        log.error("Payment processing failed: {}", ex.getMessage(), ex);
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.FAILED_DEPENDENCY.value())
                .error(HttpStatus.FAILED_DEPENDENCY.getReasonPhrase())
                .message(ex.getMessage() != null ? ex.getMessage() : ErrorCode.PAYMENT_PROCESSING_FAILED.getDefaultMessage())
                .path(getPath(request))
                .errorCode(ErrorCode.PAYMENT_PROCESSING_FAILED.getCode())
                .details(Map.of("service", "payment-service", "reason", "Payment processing failed"))
                .build();
        
        return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body(error);
    }

    /**
     * Handle ServiceUnavailableException
     * HTTP Status: 503 SERVICE UNAVAILABLE
     */
    @ExceptionHandler(ServiceUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleServiceUnavailable(
            ServiceUnavailableException ex, WebRequest request) {
        log.error("Service unavailable: {} - {}", ex.getServiceName(), ex.getMessage(), ex);
        
        String errorCode = determineServiceErrorCode(ex.getServiceName());
        String message = ex.getMessage() != null ? ex.getMessage() : 
            String.format("%s is temporarily unavailable. Please try again later.", ex.getServiceName());
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.SERVICE_UNAVAILABLE.value())
                .error(HttpStatus.SERVICE_UNAVAILABLE.getReasonPhrase())
                .message(message)
                .path(getPath(request))
                .errorCode(errorCode)
                .details(Map.of("service", ex.getServiceName(), "retryAfter", "30"))
                .build();
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }
    
    private String determineServiceErrorCode(String serviceName) {
        return switch (serviceName.toLowerCase()) {
            case "payment-service" -> ErrorCode.PAYMENT_SERVICE_UNAVAILABLE.getCode();
            case "menu-service" -> ErrorCode.MENU_SERVICE_UNAVAILABLE.getCode();
            default -> ErrorCode.SERVICE_UNAVAILABLE.getCode();
        };
    }

    /**
     * Handle validation errors from @Valid annotation
     * HTTP Status: 400 BAD REQUEST
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex, WebRequest request) {
        log.warn("Validation errors: {}", ex.getMessage());
        
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> String.format("%s: %s", error.getField(), error.getDefaultMessage()))
                .collect(Collectors.toList());
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ErrorCode.VALIDATION_FAILED.getDefaultMessage())
                .path(getPath(request))
                .validationErrors(errors)
                .errorCode(ErrorCode.VALIDATION_FAILED.getCode())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handle constraint violations
     * HTTP Status: 400 BAD REQUEST
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex, WebRequest request) {
        log.warn("Constraint violation: {}", ex.getMessage());
        
        List<String> errors = ex.getConstraintViolations()
                .stream()
                .map(violation -> String.format("%s: %s", 
                    violation.getPropertyPath(), violation.getMessage()))
                .collect(Collectors.toList());
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ErrorCode.CONSTRAINT_VIOLATION.getDefaultMessage())
                .path(getPath(request))
                .validationErrors(errors)
                .errorCode(ErrorCode.CONSTRAINT_VIOLATION.getCode())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handle database integrity violations
     * HTTP Status: 409 CONFLICT
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex, WebRequest request) {
        log.error("Data integrity violation: {}", ex.getMessage(), ex);
        
        String message = extractIntegrityViolationMessage(ex);
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value())
                .error(HttpStatus.CONFLICT.getReasonPhrase())
                .message(message)
                .path(getPath(request))
                .errorCode(ErrorCode.DATA_INTEGRITY_VIOLATION.getCode())
                .build();
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
    
    private String extractIntegrityViolationMessage(DataIntegrityViolationException ex) {
        String message = ex.getMessage();
        if (message != null) {
            if (message.contains("duplicate key")) {
                return "Duplicate entry detected. The resource already exists.";
            } else if (message.contains("foreign key")) {
                return "Referential integrity violation. Related resource does not exist.";
            } else if (message.contains("unique constraint")) {
                return "Unique constraint violation. The value already exists.";
            }
        }
        return ErrorCode.DATA_INTEGRITY_VIOLATION.getDefaultMessage();
    }

    /**
     * Handle general database exceptions
     * HTTP Status: 500 INTERNAL SERVER ERROR
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDataAccessException(
            DataAccessException ex, WebRequest request) {
        log.error("Database access error: {}", ex.getMessage(), ex);
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message(ErrorCode.DATABASE_ERROR.getDefaultMessage() + " Please try again later.")
                .path(getPath(request))
                .errorCode(ErrorCode.DATABASE_ERROR.getCode())
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Handle malformed JSON requests
     * HTTP Status: 400 BAD REQUEST
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex, WebRequest request) {
        log.warn("Malformed request: {}", ex.getMessage());
        
        String message = ex.getMessage() != null && ex.getMessage().contains("JSON") 
            ? "Invalid JSON format. Please check your request body."
            : ErrorCode.MALFORMED_REQUEST.getDefaultMessage();
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(message)
                .path(getPath(request))
                .errorCode(ErrorCode.MALFORMED_REQUEST.getCode())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handle type mismatch exceptions
     * HTTP Status: 400 BAD REQUEST
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, WebRequest request) {
        log.warn("Type mismatch: {}", ex.getMessage());
        
        String expectedType = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown";
        String message = String.format("Invalid value '%s' for parameter '%s'. Expected type: %s",
                ex.getValue(), ex.getName(), expectedType);
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(message)
                .path(getPath(request))
                .errorCode(ErrorCode.TYPE_MISMATCH.getCode())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handle IllegalArgumentException
     * HTTP Status: 400 BAD REQUEST
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex, WebRequest request) {
        log.warn("Illegal argument: {}", ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ex.getMessage() != null ? ex.getMessage() : ErrorCode.ILLEGAL_ARGUMENT.getDefaultMessage())
                .path(getPath(request))
                .errorCode(ErrorCode.ILLEGAL_ARGUMENT.getCode())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    /**
     * Handle HTTP client errors (4xx) from external services
     * HTTP Status: 502 BAD GATEWAY or original status
     */
    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<ErrorResponse> handleHttpClientError(
            HttpClientErrorException ex, WebRequest request) {
        log.error("HTTP client error from external service: {} - {}", ex.getStatusCode(), ex.getMessage());
        
        HttpStatus status = ex.getStatusCode().is4xxClientError() 
            ? HttpStatus.BAD_GATEWAY 
            : HttpStatus.INTERNAL_SERVER_ERROR;
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message("External service returned an error: " + ex.getMessage())
                .path(getPath(request))
                .errorCode(ErrorCode.BAD_GATEWAY.getCode())
                .details(Map.of("externalStatusCode", ex.getStatusCode().value()))
                .build();
        
        return ResponseEntity.status(status).body(error);
    }
    
    /**
     * Handle HTTP server errors (5xx) from external services
     * HTTP Status: 502 BAD GATEWAY
     */
    @ExceptionHandler(HttpServerErrorException.class)
    public ResponseEntity<ErrorResponse> handleHttpServerError(
            HttpServerErrorException ex, WebRequest request) {
        log.error("HTTP server error from external service: {} - {}", ex.getStatusCode(), ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_GATEWAY.value())
                .error(HttpStatus.BAD_GATEWAY.getReasonPhrase())
                .message("External service is experiencing issues. Please try again later.")
                .path(getPath(request))
                .errorCode(ErrorCode.BAD_GATEWAY.getCode())
                .details(Map.of("externalStatusCode", ex.getStatusCode().value()))
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(error);
    }
    
    /**
     * Handle resource access exceptions (connection timeouts, etc.)
     * HTTP Status: 504 GATEWAY TIMEOUT or 503 SERVICE UNAVAILABLE
     */
    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<ErrorResponse> handleResourceAccessException(
            ResourceAccessException ex, WebRequest request) {
        log.error("Resource access error: {}", ex.getMessage(), ex);
        
        HttpStatus status = ex.getMessage() != null && ex.getMessage().contains("timeout")
            ? HttpStatus.GATEWAY_TIMEOUT
            : HttpStatus.SERVICE_UNAVAILABLE;
        
        String errorCode = status == HttpStatus.GATEWAY_TIMEOUT 
            ? ErrorCode.GATEWAY_TIMEOUT.getCode()
            : ErrorCode.SERVICE_UNAVAILABLE.getCode();
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message("Unable to connect to external service. Please try again later.")
                .path(getPath(request))
                .errorCode(errorCode)
                .build();
        
        return ResponseEntity.status(status).body(error);
    }

    /**
     * Handle all other exceptions (catch-all)
     * HTTP Status: 500 INTERNAL SERVER ERROR
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, WebRequest request) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message(ErrorCode.INTERNAL_SERVER_ERROR.getDefaultMessage() + " Please try again later.")
                .path(getPath(request))
                .errorCode(ErrorCode.INTERNAL_SERVER_ERROR.getCode())
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Handle RuntimeException (for cases where we use generic RuntimeException)
     * HTTP Status: 500 INTERNAL SERVER ERROR
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(
            RuntimeException ex, WebRequest request) {
        // Check if it's already handled by more specific handlers
        if (ex instanceof OrderNotFoundException ||
            ex instanceof OrderValidationException ||
            ex instanceof PaymentProcessingException ||
            ex instanceof ServiceUnavailableException ||
            ex instanceof IllegalArgumentException) {
            throw ex; // Re-throw to be handled by specific handler
        }
        
        log.error("Runtime exception: {}", ex.getMessage(), ex);
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message(ex.getMessage() != null ? ex.getMessage() : ErrorCode.RUNTIME_ERROR.getDefaultMessage())
                .path(getPath(request))
                .errorCode(ErrorCode.RUNTIME_ERROR.getCode())
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    private String getPath(WebRequest request) {
        return request.getDescription(false).replace("uri=", "");
    }
}

