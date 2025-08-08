package com.reon.auth_backend.service.impl;

import com.reon.auth_backend.dto.UserProfileDTO;
import com.reon.auth_backend.dto.UserRequestDTO;
import com.reon.auth_backend.dto.UserResponseDTO;
import com.reon.auth_backend.exceptions.EmailAlreadyExistsException;
import com.reon.auth_backend.mapper.UserMapper;
import com.reon.auth_backend.model.User;
import com.reon.auth_backend.repository.UserRepository;
import com.reon.auth_backend.service.OtpService;
import com.reon.auth_backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    private final OtpService otpService;

    public UserServiceImpl(UserRepository userRepository, OtpService otpService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
    }

    @Override
    public UserResponseDTO registerUser(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            log.error("Email already exists");
            throw new EmailAlreadyExistsException("User already exists");
        }

        log.info("Service:: Creating new user");
        User user = UserMapper.toEntity(userRequestDTO);

        User savedUser = userRepository.save(user);
        log.info("Service:: Saving user {}", user);

        try {
            log.info("Service:: Sending verification email");
            otpService.sendVerificationEmail(userRequestDTO.getEmail());
            log.info("Service:: Verification email sent");
        } catch (Exception e) {
            log.error("Service:: Error sending verification email");
            throw new RuntimeException(e);
        }

        return UserMapper.responseToUser(savedUser);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO) {
        return null;
    }

    @Override
    public void deleteUser(Long id) {

    }

    @Override
    public boolean isUserLoggedIn(Long id) {
        return false;
    }

    @Override
    public UserProfileDTO userProfile() {
        return null;
    }
}
