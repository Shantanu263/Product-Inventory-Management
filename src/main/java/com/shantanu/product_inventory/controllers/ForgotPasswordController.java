package com.shantanu.product_inventory.controllers;

import com.shantanu.product_inventory.services.ForgotPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/forgot-password")
public class ForgotPasswordController {
    private final ForgotPasswordService forgotPasswordService;

    @PostMapping("/verifyMail/{email}")
    public ResponseEntity<String> verifyEmail(@PathVariable String email) {
        forgotPasswordService.verifyEmail(email);
        return ResponseEntity.ok("Email sent for verification");
    }

    @PostMapping("/verifyOtp/{otp}/{email}")
    public ResponseEntity<?> verifyOtp(@PathVariable int otp, @PathVariable String email){
        return forgotPasswordService.verifyOtp(otp,email);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String,String> request, @RequestAttribute Long userId){
        return forgotPasswordService.changePassword(request.get("newPassword"),userId);
    }

}


