package com.reon.auth_backend.service.impl;

import com.reon.auth_backend.exceptions.InvalidOTPException;
import com.reon.auth_backend.exceptions.OTPExpiredException;
import com.reon.auth_backend.exceptions.UserNotFoundException;
import com.reon.auth_backend.model.User;
import com.reon.auth_backend.model.VerificationToken;
import com.reon.auth_backend.repository.UserRepository;
import com.reon.auth_backend.service.EmailService;
import com.reon.auth_backend.service.OtpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class OtpServiceImpl implements OtpService {
    private final Logger log = LoggerFactory.getLogger(OtpServiceImpl.class);
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public OtpServiceImpl(UserRepository userRepository, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    // Generate 6-digits OTP
    public static String generateOTP(){
        SecureRandom random = new SecureRandom();
        int otp = random.nextInt(900000) + 100000;
        return String.valueOf(otp);
    }

    @Override
    public void sendVerificationEmail(String email) {
        // Check if user exist
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User not found")
        );

        VerificationToken verificationToken = new VerificationToken();

        // Assign an OTP
        String otp = generateOTP();
        verificationToken.setToken(otp);

        // Set expiry time
        long otpExpiryTime = System.currentTimeMillis() +  (15 * 60 * 1000);
        verificationToken.setExpiryDate(otpExpiryTime);

        verificationToken.setUser(user);

        // save otp to database
        user.setToken(verificationToken);
        userRepository.save(user);

        try {
            emailService.verificationOTP(email, user.getName(), otp);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void verifyAccount(String email, String verificationCode) {
        // Check if user exist
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User not found")
        );

        VerificationToken verificationToken = user.getToken();

        if (verificationToken == null || verificationToken.getToken() == null) {
            throw new InvalidOTPException("No OTP found or it was already used.");
        }

        if (!verificationToken.getToken().equals(verificationCode)){
            throw new InvalidOTPException("OTP does not match");
        }

        if (verificationToken.getExpiryDate() < System.currentTimeMillis()){
            throw new OTPExpiredException("OTP has expired");
        }

        user.setEmailVerified(true);
        user.setAccountEnabled(true);

        verificationToken.setToken(null);
        verificationToken.setExpiryDate(0L);

        userRepository.save(user);

        try {
            log.info("Service:: Sending welcome email to user {}", user);
            emailService.sendWelcomeEmail(email, user.getName());
            log.info("Service:: Welcome email sent");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void sendResetPasswordOTP(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User not found")
        );

        VerificationToken verificationToken = new VerificationToken();

        String resetOTP = generateOTP();
        verificationToken.setToken(resetOTP);

        long resetOTPExpiry = System.currentTimeMillis() +  (15 * 60 * 1000);
        verificationToken.setExpiryDate(resetOTPExpiry);

        verificationToken.setUser(user);
        user.setToken(verificationToken);
        userRepository.save(user);

        try {
            log.info("Service:: Sending reset password email to user {}", user);
            emailService.resetPassword(email, user.getName(), resetOTP);
            log.info("Service:: Reset Password email sent.");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void verifyResetPasswordOTP(String email, String verificationCode) {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User not found with email " + email)
        );

        VerificationToken verificationToken = user.getToken();

        if (verificationToken == null || verificationToken.getToken() == null) {
            throw new InvalidOTPException("No OTP found or it was already used.");
        }

        if (!verificationToken.getToken().equals(verificationCode)){
            throw new InvalidOTPException("OTP does not match");
        }

        if (verificationToken.getExpiryDate() < System.currentTimeMillis()){
            throw new OTPExpiredException("OTP has expired");
        }
    }

    @Override
    public void resetPassword(String email, String verificationCode, String newPassword) {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User not found with email " + email)
        );

        VerificationToken verificationToken = user.getToken();
        if (verificationToken == null || verificationToken.getToken() == null) {
            throw new InvalidOTPException("No OTP found or it was already used.");
        }

        if (!verificationToken.getToken().equals(verificationCode)){
            throw new InvalidOTPException("OTP does not match");
        }

        if (verificationToken.getExpiryDate() < System.currentTimeMillis()){
            throw new OTPExpiredException("OTP has expired");
        }

        verificationToken.setToken(null);
        verificationToken.setExpiryDate(0L);

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        try {
            log.info("Service:: Sending password reset success acknowledgement email to user {}", user);
            emailService.passwordReset(email, user.getName());
            log.info("Service:: Password reset acknowledgement email sent.");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
