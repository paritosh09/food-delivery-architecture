package com.fooddelivery.modules.order.service;

import com.fooddelivery.modules.order.dto.OrderRequest;
import com.fooddelivery.modules.order.dto.OrderResponse;
import com.fooddelivery.modules.order.entity.Order;
import com.fooddelivery.modules.order.entity.OrderItem;
import com.fooddelivery.modules.order.entity.DeliveryAddress;
import com.fooddelivery.modules.order.repository.OrderRepository;
import com.fooddelivery.modules.order.event.OrderCreatedEvent;
import com.fooddelivery.modules.order.exception.OrderNotFoundException;
import com.fooddelivery.modules.menu.entity.MenuItem;
import com.fooddelivery.modules.menu.service.MenuService;
import com.fooddelivery.modules.order.exception.OrderValidationException;
import com.fooddelivery.modules.payment.event.PaymentCompletedEvent;
import com.fooddelivery.modules.payment.event.PaymentFailedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final MenuService menuService;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        log.info("Creating order for user: {}, restaurant: {}", request.getUserId(), request.getRestaurantId());

        validateOrderRequest(request);

        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setRestaurantId(request.getRestaurantId());
        order.setStatus(Order.OrderStatus.PENDING);
        
        // Calculate total and map items
        List<OrderItem> items = request.getItems().stream()
                .map(item -> {
                    MenuItem menuItem = menuService.getMenuItem(item.getMenuItemId())
                            .orElseThrow(() -> new OrderValidationException("Menu item not found: " + item.getMenuItemId()));
                    
                    if (!menuItem.isAvailable()) {
                        throw new OrderValidationException("Menu item not available: " + menuItem.getName());
                    }

                    OrderItem orderItem = new OrderItem();
                    orderItem.setMenuItemId(item.getMenuItemId());
                    orderItem.setQuantity(item.getQuantity());
                    orderItem.setCustomization(item.getCustomization());
                    orderItem.setOrder(order);
                    orderItem.setPrice(menuItem.getPrice());
                    orderItem.setMenuItemName(menuItem.getName());
                    return orderItem;
                })
                .collect(Collectors.toList());
        
        order.setItems(items);
        
        BigDecimal totalAmount = items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);

        order.setDeliveryAddress(mapAddress(request.getDeliveryAddress()));
        order.setSpecialInstructions(request.getSpecialInstructions());

        order = orderRepository.save(order);
        log.info("Order created with ID: {}", order.getId());

        // Publish event for other modules (Payment, Notification)
        eventPublisher.publishEvent(new OrderCreatedEvent(order.getId(), order.getUserId(), order.getTotalAmount()));

        return mapToResponse(order);
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

    private DeliveryAddress mapAddress(com.fooddelivery.modules.order.dto.AddressRequest addressRequest) {
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

        List<com.fooddelivery.modules.order.dto.OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> {
                    com.fooddelivery.modules.order.dto.OrderItemResponse itemResponse = new com.fooddelivery.modules.order.dto.OrderItemResponse();
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

    private com.fooddelivery.modules.order.dto.AddressResponse mapAddressResponse(DeliveryAddress address) {
        com.fooddelivery.modules.order.dto.AddressResponse response = new com.fooddelivery.modules.order.dto.AddressResponse();
        response.setStreet(address.getStreet());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setZipCode(address.getZipCode());
        return response;
    }

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

        request.getItems().forEach(item -> {
            if (item.getMenuItemId() == null || item.getMenuItemId() <= 0) {
                throw new OrderValidationException("Invalid menu item ID");
            }
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new OrderValidationException("Item quantity must be greater than 0");
            }
        });
    }

    @EventListener
    @Transactional
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        log.info("Payment completed for order: {}. Transaction ID: {}", event.getOrderId(), event.getTransactionId());
        orderRepository.findById(event.getOrderId()).ifPresent(order -> {
            order.setStatus(Order.OrderStatus.CONFIRMED);
            order.setPaymentTransactionId(event.getTransactionId());
            orderRepository.save(order);
            log.info("Order {} confirmed", order.getId());
        });
    }

    @EventListener
    @Transactional
    public void handlePaymentFailed(PaymentFailedEvent event) {
        log.warn("Payment failed for order: {}. Reason: {}", event.getOrderId(), event.getReason());
        orderRepository.findById(event.getOrderId()).ifPresent(order -> {
            order.setStatus(Order.OrderStatus.CANCELLED);
            orderRepository.save(order);
            log.info("Order {} cancelled due to payment failure", order.getId());
        });
    }
}
