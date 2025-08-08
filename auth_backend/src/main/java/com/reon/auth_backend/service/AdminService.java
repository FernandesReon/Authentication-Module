package com.reon.auth_backend.service;

import com.reon.auth_backend.dto.UserResponseDTO;
import com.reon.auth_backend.model.User;
import org.springframework.data.domain.Page;


public interface AdminService {
    Page<UserResponseDTO> getUsers(int page, int size);

    UserResponseDTO fetchUser(Long id);
    UserResponseDTO fetchUserByEmail(String email);
    UserResponseDTO promoteUser(Long id, User.Role role);
}
