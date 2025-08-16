package com.reon.auth_backend.controllers;

import com.reon.auth_backend.dto.UserLoginDTO;
import com.reon.auth_backend.dto.UserRequestDTO;
import com.reon.auth_backend.dto.UserResponseDTO;
import com.reon.auth_backend.jwt.JwtResponse;
import com.reon.auth_backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Value("${token.expiration.time}")
    private long tokenExpirationTime;

    private final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        log.info("Controller:: Creating user {}", userRequestDTO);
        UserResponseDTO register = userService.registerUser(userRequestDTO);
        log.info("Controller:: Saving user {}", register);
        return ResponseEntity.ok().body(register);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDTO userLoginDTO, HttpServletResponse response) {
        log.info("Controller:: Login user {}", userLoginDTO);
        JwtResponse jwtToken = userService.authenticateUser(userLoginDTO);

        try {
            Cookie cookie = new Cookie("JWT", jwtToken.getToken());

            cookie.setHttpOnly(true);
            cookie.setSecure(false);    // for testing purpose false - else true
            cookie.setPath("/");
            cookie.setMaxAge((int) (tokenExpirationTime / 1000));
            cookie.setAttribute("SameSite", "Strict");

            response.addCookie(cookie);
            log.info("Controller:: Cookie added successfully");
        } catch (Exception e) {
            log.error("Controller:: Error while adding cookie", e);
            throw new RuntimeException(e);
        }

        log.info("Controller:: Successful login {}", jwtToken);
        return ResponseEntity.ok().body(jwtToken);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        try {
            Cookie cookie = new Cookie("JWT", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(0);
            cookie.setAttribute("SameSite", "Strict");
            response.addCookie(cookie);

            log.info("Controller:: Cookie removed successfully");
            return ResponseEntity.ok().body("Logout successful");
        } catch (Exception e) {
            log.error("Controller:: Error while removing cookie", e);
            throw new RuntimeException(e);
        }
    }
}
