package com.shantanu.product_inventory.Service;

import com.shantanu.product_inventory.DTO.AdminDTO;
import com.shantanu.product_inventory.DTO.changePasswordDTO;
import com.shantanu.product_inventory.Model.Admin;
import com.shantanu.product_inventory.Repository.AdminRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepo adminRepo;
    private final PasswordEncoder encoder;
    private final JWTService jwtService;

    public void registerUser(AdminDTO adminDTO) {
        Admin admin = new Admin();
        admin.setUsername(adminDTO.getUsername());
        admin.setPassword(encoder.encode(adminDTO.getPassword()));
        adminRepo.save(admin);
    }

    public ResponseEntity<?> login(AdminDTO adminDTO) {
        Admin user = adminRepo.findByUsername(adminDTO.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!encoder.matches(adminDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getUsername());
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }

    public ResponseEntity<?> changePassword(changePasswordDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Admin admin = (Admin) auth.getPrincipal();
        String username = admin.getUsername();

        Admin user = adminRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Old password is incorrect"));
        }

        if (request.getOldPassword().equals(request.getNewPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "New password must be different from old password"));
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        adminRepo.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
