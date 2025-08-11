package com.reon.auth_backend.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    private final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleException(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleException(EmailAlreadyExistsException exception) {
        logger.info(exception.getMessage());
        Map<String, String> errors = new HashMap<>();
        errors.put("email", "User with email already exists");
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RestrictionException.class)
    public ResponseEntity<Map<String, String>> handleException(RestrictionException exception) {
        logger.info(exception.getMessage());
        Map<String, String> errors = new HashMap<>();
        errors.put("restriction", "Operation not allowed");
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleException(UserNotFoundException exception) {
        logger.info(exception.getMessage());
        Map<String, String> errors = new HashMap<>();
        errors.put("user", "User not found");
        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
    }

    // OTP based exception handlers
    @ExceptionHandler(InvalidOTPException.class)
    public ResponseEntity<Map<String, String>> handleException(InvalidOTPException exception) {
        logger.info(exception.getMessage());
        Map<String, String> errors = new HashMap<>();
        errors.put("invalid", "Invalid OTP. Please try again.");
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(OTPExpiredException.class)
    public ResponseEntity<Map<String, String>> handleException(OTPExpiredException exception) {
        logger.info(exception.getMessage());
        Map<String, String> errors = new HashMap<>();
        errors.put("expired", "OTP expired. Request a new one.");
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleException(BadCredentialsException exception) {
        logger.info(exception.getMessage());
        Map<String, String> errors = new HashMap<>();
        errors.put("credentials", "Provided credentials are incorrect.");
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Map<String, String>> handleException(DisabledException exception) {
        logger.info(exception.getMessage());
        Map<String, String> errors = new HashMap<>();
        errors.put("disabled", "Account is disabled. Contact your administrator.");
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}
