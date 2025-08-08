package com.reon.auth_backend.controllers;

import com.reon.auth_backend.dto.UserRequestDTO;
import com.reon.auth_backend.dto.UserResponseDTO;
import com.reon.auth_backend.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        try {
            log.info("Controller:: Creating user {}", userRequestDTO);
            UserResponseDTO register = userService.registerUser(userRequestDTO);
            log.info("Controller:: Saving user {}", register);
            return ResponseEntity.ok().body(register);
        } catch (Exception e) {
            log.error("Controller:: Creating user failed", e);
            throw new RuntimeException(e);
        }
    }
}
