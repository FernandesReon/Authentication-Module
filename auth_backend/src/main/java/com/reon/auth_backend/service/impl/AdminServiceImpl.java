package com.reon.auth_backend.service.impl;

import com.reon.auth_backend.dto.UserResponseDTO;
import com.reon.auth_backend.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {
    @Override
    public Page<UserResponseDTO> getUsers(int page, int size) {
        return null;
    }
}
