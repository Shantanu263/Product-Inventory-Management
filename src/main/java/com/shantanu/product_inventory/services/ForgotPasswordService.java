package com.shantanu.product_inventory.services;

import org.springframework.http.ResponseEntity;

public interface ForgotPasswordService {
    void verifyEmail(String email);
    ResponseEntity<?> verifyOtp(int otp, String email);
    ResponseEntity<?> changePassword(String newPassword, Long userId);
}
