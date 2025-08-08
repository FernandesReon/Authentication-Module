package com.reon.auth_backend.service.impl;

import com.reon.auth_backend.dto.UserResponseDTO;
import com.reon.auth_backend.exceptions.UserNotFoundException;
import com.reon.auth_backend.mapper.UserMapper;
import com.reon.auth_backend.model.User;
import com.reon.auth_backend.repository.UserRepository;
import com.reon.auth_backend.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {
    private final Logger log = LoggerFactory.getLogger(AdminServiceImpl.class);
    private final UserRepository userRepository;

    public AdminServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Page<UserResponseDTO> getUsers(int pageNo, int pageSize) {
        log.info("Service:: Fetching all users with pagination: pageNo={}, pageSize={}", pageNo, pageSize);
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        Page<User> users = userRepository.findAll(pageable);
        return users.map(UserMapper::responseToUser);
    }

    @Override
    public UserResponseDTO fetchUser(Long id) {
        log.info("Service:: Fetching user with id: {}", id);
        User user = userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException("User not found with id: " + id)
        );
        return UserMapper.responseToUser(user);
    }

    @Override
    public UserResponseDTO fetchUserByEmail(String email) {
        log.info("Service:: Fetching user with email: {}", email);
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User not found with email: " + email)
        );
        return UserMapper.responseToUser(user);
    }

    @Override
    public UserResponseDTO promoteUser(Long id, User.Role role) {
        log.info("Service:: Promoting user with id: {}, to role: {}", id, role);
        User user = userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException("User not found with id: " + id)
        );
        user.getRoles().add(role);
        User promotedUser = userRepository.save(user);
        log.info("Service:: Promoted user: {}", promotedUser);
        return UserMapper.responseToUser(promotedUser);
    }
}
