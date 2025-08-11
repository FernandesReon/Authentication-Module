package com.reon.auth_backend.controllers;

import com.reon.auth_backend.dto.UserProfileDTO;
import com.reon.auth_backend.dto.UserRequestDTO;
import com.reon.auth_backend.dto.UserResponseDTO;
import com.reon.auth_backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final Logger log = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/update/id/{id}")
    @PreAuthorize("@userServiceImpl.isUserLoggedIn(#id)")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO userRequestDTO) {
        log.info("Controller:: Updating user {}", userRequestDTO);
        UserResponseDTO update = userService.updateUser(id, userRequestDTO);
        log.info("Controller:: Updated user {}", update);
        return ResponseEntity.ok().body(update);
    }

    @DeleteMapping("/remove/id/{id}")
    @PreAuthorize("@userServiceImpl.isUserLoggedIn(#id)")
    public ResponseEntity<UserResponseDTO> removeUser(@PathVariable Long id) {
        log.info("Controller:: Removing user {}", id);
        userService.deleteUser(id);
        return ResponseEntity.ok().body(new UserResponseDTO());
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> userProfile(){
        log.info("Controller:: Fetching user profile");
        UserProfileDTO userProfileDTO = userService.userProfile();
        log.info("Controller:: Fetched user profile");
        return ResponseEntity.ok().body(userProfileDTO);
    }
}
