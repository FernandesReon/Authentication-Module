package com.reon.auth_backend.service;

import com.reon.auth_backend.dto.UserLoginDTO;
import com.reon.auth_backend.dto.UserProfileDTO;
import com.reon.auth_backend.dto.UserRequestDTO;
import com.reon.auth_backend.dto.UserResponseDTO;
import com.reon.auth_backend.jwt.JwtResponse;

public interface UserService {
    UserResponseDTO registerUser(UserRequestDTO userRequestDTO);
    UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO);
    void deleteUser(Long id);

    JwtResponse authenticateUser(UserLoginDTO loginDTO);
    boolean isUserLoggedIn(Long id);
    UserProfileDTO userProfile();
}
