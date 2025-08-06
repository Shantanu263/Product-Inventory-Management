package com.shantanu.product_inventory.Controller;

import com.shantanu.product_inventory.DTO.AdminDTO;
import com.shantanu.product_inventory.DTO.changePasswordDTO;
import com.shantanu.product_inventory.Repository.AdminRepo;
import com.shantanu.product_inventory.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
