package com.reon.auth_backend.service;

public interface EmailService {
    void sendWelcomeEmail(String recipient, String name);
    void verificationOTP(String recipient, String name, String otp);
    void resetPassword(String recipient, String name, String otp);
    void passwordReset(String recipient, String name);
}
