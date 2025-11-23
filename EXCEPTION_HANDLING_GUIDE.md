# Exception Handling Guide

## Overview

This project implements comprehensive exception handling with proper HTTP status codes and meaningful error messages. All exceptions are handled centrally through the `GlobalExceptionHandler` class.

## HTTP Status Code Mapping

### 400 Bad Request
Used for client errors related to invalid input or malformed requests.

| Exception | Error Code | Message |
|-----------|------------|---------|
| `OrderValidationException` | `ORDER_VALIDATION_FAILED` | Order validation failed |
| `MethodArgumentNotValidException` | `VALIDATION_FAILED` | Request validation failed |
| `ConstraintViolationException` | `CONSTRAINT_VIOLATION` | Constraint violation |
| `HttpMessageNotReadableException` | `MALFORMED_REQUEST` | Invalid JSON format |
| `MethodArgumentTypeMismatchException` | `TYPE_MISMATCH` | Invalid parameter type |
| `IllegalArgumentException` | `ILLEGAL_ARGUMENT` | Illegal argument provided |

**Example Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Order validation failed",
  "path": "/api/orders",
  "errorCode": "ORDER_VALIDATION_FAILED",
  "validationErrors": [
    "userId: must not be null",
    "items: must not be empty"
  ]
}
```

### 404 Not Found
Used when a requested resource cannot be found.

| Exception | Error Code | Message |
|-----------|------------|---------|
| `OrderNotFoundException` | `ORDER_NOT_FOUND` | Order not found with ID: {id} |

**Example Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Order not found with ID: 123",
  "path": "/api/orders/123",
  "errorCode": "ORDER_NOT_FOUND"
}
```

### 409 Conflict
Used when the request conflicts with the current state of the resource.

| Exception | Error Code | Message |
|-----------|------------|---------|
| `DataIntegrityViolationException` | `DATA_INTEGRITY_VIOLATION` | Duplicate entry detected / Referential integrity violation |

**Example Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "Duplicate entry detected. The resource already exists.",
  "path": "/api/orders",
  "errorCode": "DATA_INTEGRITY_VIOLATION"
}
```

### 424 Failed Dependency
Used when the operation failed because it depended on another operation that failed.

| Exception | Error Code | Message |
|-----------|------------|---------|
| `PaymentProcessingException` | `PAYMENT_PROCESSING_FAILED` | Payment processing failed |

**Example Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 424,
  "error": "Failed Dependency",
  "message": "Payment processing failed for order 123: Insufficient funds",
  "path": "/api/orders",
  "errorCode": "PAYMENT_PROCESSING_FAILED",
  "details": {
    "service": "payment-service",
    "reason": "Payment processing failed"
  }
}
```

### 500 Internal Server Error
Used for unexpected server errors.

| Exception | Error Code | Message |
|-----------|------------|---------|
| `DataAccessException` | `DATABASE_ERROR` | Database operation failed |
| `Exception` (catch-all) | `INTERNAL_SERVER_ERROR` | Internal server error |
| `RuntimeException` | `RUNTIME_ERROR` | Unexpected runtime error |

**Example Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Database operation failed. Please try again later.",
  "path": "/api/orders",
  "errorCode": "DATABASE_ERROR"
}
```

### 502 Bad Gateway
Used when an upstream server returns an invalid response.

| Exception | Error Code | Message |
|-----------|------------|---------|
| `HttpClientErrorException` | `BAD_GATEWAY` | External service returned an error |
| `HttpServerErrorException` | `BAD_GATEWAY` | External service is experiencing issues |

**Example Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 502,
  "error": "Bad Gateway",
  "message": "External service returned an error: 400 Bad Request",
  "path": "/api/orders",
  "errorCode": "BAD_GATEWAY",
  "details": {
    "externalStatusCode": 400
  }
}
```

### 503 Service Unavailable
Used when an external service is temporarily unavailable.

| Exception | Error Code | Message |
|-----------|------------|---------|
| `ServiceUnavailableException` | `SERVICE_UNAVAILABLE` | Service temporarily unavailable |
| `ServiceUnavailableException` (payment) | `PAYMENT_SERVICE_UNAVAILABLE` | Payment service unavailable |
| `ServiceUnavailableException` (menu) | `MENU_SERVICE_UNAVAILABLE` | Menu service unavailable |
| `ResourceAccessException` | `SERVICE_UNAVAILABLE` | Unable to connect to external service |

**Example Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 503,
  "error": "Service Unavailable",
  "message": "Payment service is temporarily unavailable. Please try again later.",
  "path": "/api/orders",
  "errorCode": "PAYMENT_SERVICE_UNAVAILABLE",
  "details": {
    "service": "payment-service",
    "retryAfter": "30"
  }
}
```

### 504 Gateway Timeout
Used when an upstream server does not respond in time.

| Exception | Error Code | Message |
|-----------|------------|---------|
| `ResourceAccessException` (timeout) | `GATEWAY_TIMEOUT` | Unable to connect to external service |

**Example Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 504,
  "error": "Gateway Timeout",
  "message": "Unable to connect to external service. Please try again later.",
  "path": "/api/orders",
  "errorCode": "GATEWAY_TIMEOUT"
}
```

## Error Response Structure

All error responses follow this standard structure:

```json
{
  "timestamp": "2024-01-15T10:30:00",      // ISO 8601 timestamp
  "status": 400,                            // HTTP status code
  "error": "Bad Request",                   // HTTP status reason phrase
  "message": "Detailed error message",      // Human-readable error message
  "path": "/api/orders",                   // Request path
  "errorCode": "ORDER_VALIDATION_FAILED",  // Application-specific error code
  "traceId": "abc123",                     // Optional: for distributed tracing
  "validationErrors": [                    // Optional: for validation errors
    "userId: must not be null"
  ],
  "details": {                             // Optional: additional error details
    "service": "payment-service"
  }
}
```

## Custom Exceptions

### OrderNotFoundException
Thrown when an order cannot be found.

```java
throw new OrderNotFoundException("Order not found with ID: " + orderId);
```

### OrderValidationException
Thrown when order validation fails.

```java
throw new OrderValidationException("Order must contain at least one item");
// Or with multiple errors:
throw new OrderValidationException("Validation failed", List.of("Error 1", "Error 2"));
```

### PaymentProcessingException
Thrown when payment processing fails.

```java
throw new PaymentProcessingException("Payment failed: Insufficient funds");
```

### ServiceUnavailableException
Thrown when an external service is unavailable.

```java
throw new ServiceUnavailableException("payment-service", "Payment service is temporarily unavailable");
```

## Best Practices

### 1. Use Specific Exceptions
Always use the most specific exception type rather than generic `RuntimeException`.

✅ **Good:**
```java
throw new OrderNotFoundException("Order not found with ID: " + orderId);
```

❌ **Bad:**
```java
throw new RuntimeException("Order not found: " + orderId);
```

### 2. Provide Meaningful Messages
Error messages should be clear and actionable.

✅ **Good:**
```java
throw new OrderValidationException("Order must contain at least one item");
```

❌ **Bad:**
```java
throw new OrderValidationException("Invalid order");
```

### 3. Include Context
Include relevant context in error messages (IDs, values, etc.).

✅ **Good:**
```java
throw new OrderNotFoundException("Order not found with ID: " + orderId);
```

❌ **Bad:**
```java
throw new OrderNotFoundException("Order not found");
```

### 4. Log Before Throwing
Always log exceptions before throwing them (if not already logged by handler).

```java
log.error("Payment processing failed for order: {}", orderId, ex);
throw new PaymentProcessingException("Payment failed for order " + orderId, ex);
```

### 5. Use Error Codes
All exceptions map to specific error codes for client-side handling.

```java
ErrorCode.ORDER_NOT_FOUND.getCode()  // Returns "ORDER_NOT_FOUND"
```

## Exception Handling Flow

```
Client Request
    ↓
Controller
    ↓
Service Layer (throws custom exceptions)
    ↓
GlobalExceptionHandler (catches and converts)
    ↓
ErrorResponse DTO
    ↓
HTTP Response with proper status code
```

## Testing Exception Handling

### Test Order Not Found
```bash
curl -X GET http://localhost:8081/api/orders/999
# Response: 404 with ORDER_NOT_FOUND error code
```

### Test Validation Error
```bash
curl -X POST http://localhost:8081/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": null}'
# Response: 400 with VALIDATION_FAILED error code
```

### Test Service Unavailable
```bash
# When payment service is down
curl -X POST http://localhost:8081/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "restaurantId": 1, "items": [...]}'
# Response: 503 with PAYMENT_SERVICE_UNAVAILABLE error code
```

## Error Code Reference

See `ErrorCode` enum for complete list of error codes:

- `INVALID_REQUEST` - 400
- `VALIDATION_FAILED` - 400
- `ORDER_VALIDATION_FAILED` - 400
- `ORDER_NOT_FOUND` - 404
- `DATA_INTEGRITY_VIOLATION` - 409
- `PAYMENT_PROCESSING_FAILED` - 424
- `SERVICE_UNAVAILABLE` - 503
- `PAYMENT_SERVICE_UNAVAILABLE` - 503
- `DATABASE_ERROR` - 500
- `INTERNAL_SERVER_ERROR` - 500
- And more...

## Summary

✅ **All exceptions are handled** with proper HTTP status codes  
✅ **Consistent error response format** across all endpoints  
✅ **Meaningful error messages** for debugging and user feedback  
✅ **Error codes** for programmatic error handling  
✅ **Validation errors** are clearly reported  
✅ **External service errors** are properly mapped  
✅ **Database errors** are handled gracefully  
✅ **Comprehensive logging** for troubleshooting  

The exception handling system ensures that:
- Clients receive consistent, actionable error messages
- Developers can easily debug issues with detailed logs
- Error codes enable programmatic error handling
- All edge cases are covered with appropriate HTTP status codes

