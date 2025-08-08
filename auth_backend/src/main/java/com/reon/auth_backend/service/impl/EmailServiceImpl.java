package com.reon.auth_backend.service.impl;

import com.reon.auth_backend.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.emailSender}")
    private String emailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendWelcomeEmail(String recipient, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(emailSender);
        message.setTo(recipient);
        message.setSubject("Welcome to Auth Module!");

        message.setText("Hi " + name + ",\n\n" +
                "Welcome aboard!\n\n" +
                "You’ve successfully joined the Auth Module – a secure and customizable authentication system built with Spring Boot and React.\n" +
                "With features like JWT-based login, OTP verification, and blazing-fast Redis caching, you're all set to integrate secure auth into your applications.\n\n" +
                "Need help getting started? Feel free to reach out.\n\n" +
                "Best,\n" +
                "The Auth Module Team");

        mailSender.send(message);
    }

    @Override
    public void verificationOTP(String recipient, String name, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(emailSender);
        message.setTo(recipient);
        message.setSubject("Verify Your Auth Module Account");

        String emailBody = "Hello " + name + ",\n\n"
                + "To complete your signup, please use the following One-Time Password (OTP): " + otp + "\n"
                + "This OTP is valid for 15 minutes.\n\n"
                + "If you didn’t request this, please disregard this email.\n\n"
                + "Cheers,\n"
                + "The Auth Module Team";

        message.setText(emailBody);
        mailSender.send(message);
    }

    @Override
    public void resetPassword(String recipient, String name, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(emailSender);
        message.setTo(recipient);
        message.setSubject("Reset Your Auth Module Password");

        String emailBody = "Hi " + name + ",\n\n"
                + "We received a request to reset your Auth Module password.\n"
                + "Your OTP for resetting is: " + otp + "\n"
                + "This OTP is valid for 5 minutes.\n\n"
                + "If this wasn’t you, no worries – just ignore this message.\n\n"
                + "Regards,\n"
                + "The Auth Module Team";

        message.setText(emailBody);
        mailSender.send(message);
    }

    @Override
    public void passwordReset(String recipient, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(emailSender);
        message.setTo(recipient);
        message.setSubject("Your Auth Module Password Was Reset");

        String emailBody = "Hi " + name + ",\n\n"
                + "Just a heads-up – your password was successfully updated.\n"
                + "If this wasn’t you, please contact our support team immediately.\n\n"
                + "Stay secure,\n"
                + "The Auth Module Team";

        message.setText(emailBody);
        mailSender.send(message);
    }

}
