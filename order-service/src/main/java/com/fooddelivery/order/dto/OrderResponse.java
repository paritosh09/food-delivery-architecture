package com.fooddelivery.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long userId;
    private Long restaurantId;
    private String orderStatus;
    private BigDecimal totalAmount;
    private List<OrderItemResponse> items;
    private AddressResponse deliveryAddress;
    private PaymentInfo paymentInfo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class OrderItemResponse {
    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private Integer quantity;
    private BigDecimal price;
    private String customization;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class AddressResponse {
    private String street;
    private String city;
    private String state;
    private String zipCode;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class PaymentInfo {
    private String paymentStatus;
    private String paymentMethod;
    private String transactionId;
}

