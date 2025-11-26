package com.fooddelivery.modules.order.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryAddress {
    private String street;
    private String city;
    private String state;
    private String zipCode;
}
