package com.reon.auth_backend.service;

import com.reon.auth_backend.dto.UserProfileDTO;
import com.reon.auth_backend.dto.UserRequestDTO;
import com.reon.auth_backend.dto.UserResponseDTO;

public interface UserService {
    UserResponseDTO registerUser(UserRequestDTO userRequestDTO);
    UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO);
    void deleteUser(Long id);

    boolean isUserLoggedIn(Long id);
    UserProfileDTO userProfile();
}
