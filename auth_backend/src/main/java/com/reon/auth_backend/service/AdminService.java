package com.reon.auth_backend.service;

import com.reon.auth_backend.dto.UserResponseDTO;
import org.springframework.data.domain.Page;

public interface AdminService {
    Page<UserResponseDTO> getUsers(int page, int size);
    // TODO:: include method to promote users
}
