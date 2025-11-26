package com.fooddelivery.modules.order.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @NotEmpty(message = "Order items cannot be empty")
    private List<OrderItemRequest> items;

    @NotNull(message = "Delivery address is required")
    private AddressRequest deliveryAddress;

    private String specialInstructions;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class OrderItemRequest {
    @NotNull(message = "Menu item ID is required")
    private Long menuItemId;

    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    private String customization;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class AddressRequest {
    @NotEmpty(message = "Street is required")
    private String street;

    @NotEmpty(message = "City is required")
    private String city;

    @NotEmpty(message = "State is required")
    private String state;

    @NotEmpty(message = "Zip code is required")
    private String zipCode;
}
