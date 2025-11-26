package com.fooddelivery.modules.auth.dto;

import com.fooddelivery.modules.auth.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private User.Role role;
    private String name;
    private String email;
}
