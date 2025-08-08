package com.reon.auth_backend.service;

public interface OtpService {
    // Account Verification
    void sendVerificationEmail(String email);
    void verifyAccount(String email, String verificationCode);

    // reset password
    void sendResetPasswordOTP(String email);
    void verifyResetPasswordOTP(String email, String verificationCode);
    void resetPassword(String email, String verificationCode, String newPassword);
}
