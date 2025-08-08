package com.reon.auth_backend.service.impl;

import com.reon.auth_backend.dto.UserLoginDTO;
import com.reon.auth_backend.dto.UserProfileDTO;
import com.reon.auth_backend.dto.UserRequestDTO;
import com.reon.auth_backend.dto.UserResponseDTO;
import com.reon.auth_backend.exceptions.EmailAlreadyExistsException;
import com.reon.auth_backend.exceptions.RestrictionException;
import com.reon.auth_backend.exceptions.UserNotFoundException;
import com.reon.auth_backend.jwt.JwtResponse;
import com.reon.auth_backend.jwt.JwtUtils;
import com.reon.auth_backend.mapper.UserMapper;
import com.reon.auth_backend.model.User;
import com.reon.auth_backend.repository.UserRepository;
import com.reon.auth_backend.service.OtpService;
import com.reon.auth_backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    private final OtpService otpService;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public UserServiceImpl(UserRepository userRepository, OtpService otpService, JwtUtils jwtUtils,
                           PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public UserResponseDTO registerUser(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            log.error("Email already exists");
            throw new EmailAlreadyExistsException("User already exists");
        }

        log.info("Service:: Creating new user");
        User user = UserMapper.toEntity(userRequestDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

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
        User user = userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException("User not found")
        );

        if (userRequestDTO.getEmail() != null && !userRequestDTO.getEmail().isBlank()){
            throw new RestrictionException("Updating email is not allowed");
        }
        try {
            log.info("Service:: Updating user {}", user);

            UserMapper.updateUser(user, userRequestDTO);
            user.preUpdate();
            User updatedUser = userRepository.save(user);

            log.info("Service:: Updated user {}", user);
            return UserMapper.responseToUser(updatedUser);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteUser(Long id) {
        log.debug("Service:: Request to delete user: {}", id);
        userRepository.deleteById(id);
    }

    @Override
    public JwtResponse authenticateUser(UserLoginDTO loginDTO) {
        try {
            log.info("Service:: Authenticating user {}", loginDTO);
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwtToken = jwtUtils.generateToken((User) userDetails);

            return new JwtResponse(jwtToken);
        } catch (AuthenticationException e) {
            log.error("Service:: Authentication failed", e);
            throw new RuntimeException(e);
        }

    }

    @Override
    public boolean isUserLoggedIn(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedEmail = authentication.getName();
        User authenticatedUser = userRepository.findByEmail(authenticatedEmail).orElseThrow(
                () -> new UserNotFoundException("User not found with email " + authenticatedEmail)
        );
        return authenticatedUser.getId().equals(id);
    }

    @Override
    public UserProfileDTO userProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticateEmail = authentication.getName();

        User user = userRepository.findByEmail(authenticateEmail).orElseThrow(
                () -> new UserNotFoundException("User not found with email " + authenticateEmail)
        );

        return UserMapper.toProfile(user);
    }
}
