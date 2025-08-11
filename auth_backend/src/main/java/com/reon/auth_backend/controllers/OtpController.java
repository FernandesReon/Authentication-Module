package com.reon.auth_backend.controllers;

import com.reon.auth_backend.dto.AccountVerificationDTO;
import com.reon.auth_backend.dto.ResetPasswordDTO;
import com.reon.auth_backend.dto.VerifyOTPDTO;
import com.reon.auth_backend.service.OtpService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
public class OtpController {
    private final Logger log = LoggerFactory.getLogger(OtpController.class);
    private final OtpService otpService;

    public OtpController(OtpService otpService) {
        this.otpService = otpService;
    }

    // Account Verification -> Registration
    @PostMapping("/verify-account")
    public ResponseEntity<String> verifyAccount(@RequestParam String email,
                                                @Valid @RequestBody AccountVerificationDTO accountVerificationDTO) {
        log.info("Controller:: Verifying account {}", accountVerificationDTO);
        otpService.verifyAccount(email, accountVerificationDTO.getOtp());
        log.info("Controller:: Verified account {}", accountVerificationDTO);
        return ResponseEntity.ok().body("Account verified");
    }

    // Resend Account Verification OTP -> Registration
    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendVerificationOTP(@RequestParam String email){
        log.info("Controller:: Resending otp {}", email);
        otpService.sendVerificationEmail(email);
        log.info("Controller:: OTP sent {}", email);
        return ResponseEntity.ok().body("OTP sent");
    }

    // Reset Password -> before login
    @PostMapping("/reset-password")
    public ResponseEntity<String> sendResetPasswordOTP(@RequestParam String email){
        log.info("Controller:: Sending reset password otp {}", email);
        otpService.sendResetPasswordOTP(email);
        log.info("Controller:: Reset Password OTP sent {}", email);
        return ResponseEntity.ok().body("OTP sent");
    }

    // Opt confirmation -> step before resetting password for login
    @PostMapping("/verify-reset-otp")
    public ResponseEntity<String> verifyResetOTP(@Valid @RequestBody VerifyOTPDTO verifyOTPDTO){
        log.info("Controller:: Verifying reset otp {}", verifyOTPDTO);
        otpService.verifyResetPasswordOTP(verifyOTPDTO.getEmail(), verifyOTPDTO.getOtp());
        log.info("Controller:: Reset Password Verification success {}", verifyOTPDTO);
        return ResponseEntity.ok().body("OTP verified");
    }

    // Actual password reset endpoint
    @PostMapping("/new-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordDTO resetPasswordDTO){
        log.info("Controller:: Resetting password {}", resetPasswordDTO);
        otpService.resetPassword(resetPasswordDTO.getEmail(), resetPasswordDTO.getOtp(), resetPasswordDTO.getNewPassword());
        log.info("Controller:: Password reset success {}", resetPasswordDTO);
        return ResponseEntity.ok().body("Password reset success");
    }
}
