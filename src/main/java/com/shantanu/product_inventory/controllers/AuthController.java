package com.shantanu.product_inventory.controllers;

import com.shantanu.product_inventory.dtos.AdminDTO;
import com.shantanu.product_inventory.dtos.changePasswordDTO;
import com.shantanu.product_inventory.repositories.AdminRepo;
import com.shantanu.product_inventory.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AdminRepo userRepo;
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody AdminDTO adminDTO) {
        if (userRepo.existsByUsername(adminDTO.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken");
        }
        authService.registerUser(adminDTO);
        return ResponseEntity.ok("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminDTO adminDTO) {
        return authService.login(adminDTO);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody changePasswordDTO request) {
        return authService.changePassword(request);
    }

    @PostMapping("/refresh-token")
    public  ResponseEntity<?> refresh(@RequestBody Map<String,String> refreshToken){
        return authService.refresh(refreshToken);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        authService.logout();
        return ResponseEntity.ok("Logged out successfully");
    }

}
