package com.fooddelivery.modules.catalog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "restaurants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String description;

    private String imageUrl;

    private Double rating;

    private String deliveryTime;

    private String priceForTwo;

    private boolean isPromoted;

    private boolean isVeg;

    @Column(nullable = false)
    private boolean isActive = true;

    // In a real app, Address would be a separate entity or embeddable
    private String address;
}
