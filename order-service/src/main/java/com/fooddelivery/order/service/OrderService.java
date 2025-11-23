package com.fooddelivery.order.service;

import com.fooddelivery.order.client.PaymentServiceClient;
import com.fooddelivery.order.dto.OrderRequest;
import com.fooddelivery.order.dto.OrderResponse;
import com.fooddelivery.order.dto.PaymentRequest;
import com.fooddelivery.order.dto.PaymentResponse;
import com.fooddelivery.order.entity.Order;
import com.fooddelivery.order.entity.OrderItem;
import com.fooddelivery.order.entity.DeliveryAddress;
import com.fooddelivery.order.repository.OrderRepository;
import com.fooddelivery.order.producer.OrderEventProducer;
import com.fooddelivery.order.exception.OrderNotFoundException;
import com.fooddelivery.order.exception.OrderValidationException;
import com.fooddelivery.order.exception.PaymentProcessingException;
import com.fooddelivery.order.exception.ServiceUnavailableException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Order Service
 * 
 * PROBLEM: This service needs to call Payment Service, Menu Service, User Service
 * Each call adds latency and failure points
 * 
 * In a monolith, these would be direct method calls:
 * - paymentService.processPayment() - 0ms latency
 * - menuService.getMenuItem() - 0ms latency
 * - userService.getUser() - 0ms latency
 * 
 * Current: 3 HTTP calls = 300-600ms total latency
 * Monolith: 3 method calls = <1ms total latency
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentServiceClient paymentServiceClient;
    private final OrderEventProducer orderEventProducer;

    /**
     * Create a new order
     * 
     * Flow:
     * 1. Validate order (calls Menu Service - not shown)
     * 2. Create order in database
     * 3. Call Payment Service (HTTP call with circuit breaker)
     * 4. Publish order.created event to Kafka
     * 5. Return order response
     * 
     * PROBLEM: Multiple external dependencies
     * - Payment Service call can fail or timeout
     * - Kafka publish can fail
     * - Each adds latency
     */
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        log.info("Creating order for user: {}, restaurant: {}", request.getUserId(), request.getRestaurantId());

        // Validate order request
        validateOrderRequest(request);

        // Create order entity
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setRestaurantId(request.getRestaurantId());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotalAmount(calculateTotal(request));
        order.setDeliveryAddress(mapAddress(request.getDeliveryAddress()));
        order.setSpecialInstructions(request.getSpecialInstructions());

        // Map order items
        List<OrderItem> items = request.getItems().stream()
                .map(item -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setMenuItemId(item.getMenuItemId());
                    orderItem.setQuantity(item.getQuantity());
                    orderItem.setCustomization(item.getCustomization());
                    orderItem.setOrder(order);
                    // TODO: Call Menu Service to get price and name
                    orderItem.setPrice(BigDecimal.valueOf(10.00)); // Placeholder
                    orderItem.setMenuItemName("Menu Item"); // Placeholder
                    return orderItem;
                })
                .collect(Collectors.toList());
        order.setItems(items);

        // Save order
        order = orderRepository.save(order);
        log.info("Order created with ID: {}", order.getId());

        // Process payment asynchronously
        processPaymentAsync(order);

        // Publish order created event
        try {
            orderEventProducer.publishOrderCreated(order);
            log.info("Order created event published for order: {}", order.getId());
        } catch (Exception e) {
            log.error("Failed to publish order created event for order: {}", order.getId(), e);
            // Continue even if event publish fails
        }

        return mapToResponse(order);
    }

    /**
     * Process payment asynchronously
     * 
     * PROBLEM: This is an HTTP call to Payment Service
     * - Network latency: 50-200ms
     * - Circuit breaker overhead: 5-10ms
     * - Retry overhead: if fails, adds more latency
     * 
     * In a monolith: paymentService.processPayment() - direct call, <1ms
     */
    private void processPaymentAsync(Order order) {
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setOrderId(order.getId());
        paymentRequest.setAmount(order.getTotalAmount());
        paymentRequest.setPaymentMethod("CREDIT_CARD");
        paymentRequest.setUserId(order.getUserId().toString());

        CompletableFuture<PaymentResponse> paymentFuture = paymentServiceClient.processPayment(paymentRequest);

        paymentFuture.thenAccept(paymentResponse -> {
            log.info("Payment processed for order {}: {}", order.getId(), paymentResponse.getStatus());
            if ("SUCCESS".equals(paymentResponse.getStatus())) {
                order.setPaymentTransactionId(paymentResponse.getTransactionId());
                order.setStatus(Order.OrderStatus.CONFIRMED);
                orderRepository.save(order);
            } else {
                log.error("Payment failed for order {}: {}", order.getId(), paymentResponse.getMessage());
                order.setStatus(Order.OrderStatus.CANCELLED);
                orderRepository.save(order);
                throw new PaymentProcessingException("Payment failed for order " + order.getId() + ": " + paymentResponse.getMessage());
            }
        }).exceptionally(ex -> {
            log.error("Payment processing failed for order: {}", order.getId(), ex);
            order.setStatus(Order.OrderStatus.CANCELLED);
            orderRepository.save(order);
            
            // Determine if it's a service unavailability or other error
            if (ex.getCause() instanceof java.util.concurrent.TimeoutException ||
                ex.getCause() instanceof java.net.ConnectException) {
                throw new ServiceUnavailableException("payment-service", 
                    "Payment service is temporarily unavailable", ex);
            }
            throw new PaymentProcessingException("Payment processing failed for order " + order.getId(), ex);
        });
    }

    public OrderResponse getOrder(Long orderId) {
        if (orderId == null || orderId <= 0) {
            throw new IllegalArgumentException("Invalid order ID: " + orderId);
        }
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
        return mapToResponse(order);
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BigDecimal calculateTotal(OrderRequest request) {
        // TODO: Call Menu Service to get actual prices
        // This is another HTTP call that adds latency
        return BigDecimal.valueOf(50.00); // Placeholder
    }

    private DeliveryAddress mapAddress(com.fooddelivery.order.dto.AddressRequest addressRequest) {
        DeliveryAddress address = new DeliveryAddress();
        address.setStreet(addressRequest.getStreet());
        address.setCity(addressRequest.getCity());
        address.setState(addressRequest.getState());
        address.setZipCode(addressRequest.getZipCode());
        return address;
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
        response.setRestaurantId(order.getRestaurantId());
        response.setOrderStatus(order.getStatus().name());
        response.setTotalAmount(order.getTotalAmount());
        response.setDeliveryAddress(mapAddressResponse(order.getDeliveryAddress()));
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        // Map items
        List<com.fooddelivery.order.dto.OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> {
                    com.fooddelivery.order.dto.OrderItemResponse itemResponse = new com.fooddelivery.order.dto.OrderItemResponse();
                    itemResponse.setId(item.getId());
                    itemResponse.setMenuItemId(item.getMenuItemId());
                    itemResponse.setMenuItemName(item.getMenuItemName());
                    itemResponse.setQuantity(item.getQuantity());
                    itemResponse.setPrice(item.getPrice());
                    itemResponse.setCustomization(item.getCustomization());
                    return itemResponse;
                })
                .collect(Collectors.toList());
        response.setItems(itemResponses);

        return response;
    }

    private com.fooddelivery.order.dto.AddressResponse mapAddressResponse(DeliveryAddress address) {
        com.fooddelivery.order.dto.AddressResponse response = new com.fooddelivery.order.dto.AddressResponse();
        response.setStreet(address.getStreet());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setZipCode(address.getZipCode());
        return response;
    }

    /**
     * Validate order request
     * Throws OrderValidationException if validation fails
     */
    private void validateOrderRequest(OrderRequest request) {
        if (request == null) {
            throw new OrderValidationException("Order request cannot be null");
        }

        if (request.getUserId() == null || request.getUserId() <= 0) {
            throw new OrderValidationException("Invalid user ID");
        }

        if (request.getRestaurantId() == null || request.getRestaurantId() <= 0) {
            throw new OrderValidationException("Invalid restaurant ID");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new OrderValidationException("Order must contain at least one item");
        }

        if (request.getDeliveryAddress() == null) {
            throw new OrderValidationException("Delivery address is required");
        }

        // Validate each order item
        request.getItems().forEach(item -> {
            if (item.getMenuItemId() == null || item.getMenuItemId() <= 0) {
                throw new OrderValidationException("Invalid menu item ID");
            }
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new OrderValidationException("Item quantity must be greater than 0");
            }
        });
    }
}

