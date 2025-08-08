package com.reon.auth_backend.controllers;

import com.reon.auth_backend.dto.UserResponseDTO;
import com.reon.auth_backend.model.User;
import com.reon.auth_backend.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final Logger log = LoggerFactory.getLogger(AdminController.class);
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponseDTO>> fetchUsers(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "10") int size){
        try {
            log.info("Controller:: Fetching all users from pageNo={} pageSize={}", page, size);
            Page<UserResponseDTO> allUsers = adminService.getUsers(page, size);
            return ResponseEntity.ok().body(allUsers);
        } catch (Exception e) {
            log.error("Controller:: Fetching all users failed", e);
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/id/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> fetchById(@PathVariable Long id){
        log.info("Controller:: Fetching user with id: {}", id);
        UserResponseDTO user = adminService.fetchUser(id);
        log.info("Controller:: Fetched user with id: {}", id);
        return ResponseEntity.ok().body(user);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> fetchByEmail(@PathVariable String email){
        log.info("Controller:: Fetching user with email: {}", email);
        UserResponseDTO user = adminService.fetchUserByEmail(email);
        log.info("Controller:: Fetched user with email: {}", email);
        return ResponseEntity.ok().body(user);
    }

    @PostMapping("/{id}/promote-to-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> promoteToAdmin(@PathVariable Long id){
        log.info("Controller:: Promote user with id: {}", id);
        UserResponseDTO updateUser = adminService.promoteUser(id, User.Role.ADMIN);
        log.info("Controller :: User has been promoted");
        return ResponseEntity.ok().body(updateUser);
    }
}