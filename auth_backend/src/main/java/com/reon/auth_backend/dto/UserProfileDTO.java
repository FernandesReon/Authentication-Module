package com.reon.auth_backend.dto;

import com.reon.auth_backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
    private Long id;
    private String name;
    private String email;
    private Set<User.Role> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
