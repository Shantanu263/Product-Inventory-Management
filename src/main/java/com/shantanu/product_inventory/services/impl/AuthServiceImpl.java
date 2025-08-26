package com.shantanu.product_inventory.services.impl;

import com.shantanu.product_inventory.dtos.AdminDTO;
import com.shantanu.product_inventory.dtos.changePasswordDTO;
import com.shantanu.product_inventory.globalExceptionHandlers.ResourceNotFoundException;
import com.shantanu.product_inventory.models.Admin;
import com.shantanu.product_inventory.repositories.AdminRepo;
import com.shantanu.product_inventory.services.AuthService;
import com.shantanu.product_inventory.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AdminRepo adminRepo;
    private final PasswordEncoder encoder;
    private final JWTService jwtService;

    @Value("${jwt.accessTokenTime}")
    private long accessTokenTime;

    @Value("${jwt.refreshTokenTime}")
    private long refreshTokenTime;


    @Override
    public void registerUser(AdminDTO adminDTO) {
        Admin admin = new Admin();
        admin.setUsername(adminDTO.getUsername());
        admin.setPassword(encoder.encode(adminDTO.getPassword()));
        admin.setRole("CUSTOMER");                 //default signup customer
        adminRepo.save(admin);
    }

    @Override
    public ResponseEntity<?> login(AdminDTO adminDTO) {
        Admin user = adminRepo.findByUsername(adminDTO.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!encoder.matches(adminDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole(), accessTokenTime);
        String refreshToken = jwtService.generateToken(user.getUsername(),user.getRole(), refreshTokenTime);
        String role = user.getRole();

        Map<String, String> tokens = Map.of("accessToken", token, "refreshToken", refreshToken, "role", role);
        return ResponseEntity.ok(tokens);
    }

    @Override
    public ResponseEntity<?> changePassword(changePasswordDTO request) {
        Admin admin = fetchUserDetails();
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


    @Override
    public Admin fetchUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Admin) auth.getPrincipal();
    }

    @Override
    public ResponseEntity<?> refresh(Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || refreshToken.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Refresh token not found");
        }

        String username = jwtService.extractUsername(refreshToken);
        Admin user = adminRepo.findByUsername(username)
                .orElseThrow(()->new UsernameNotFoundException("User not found"));

        if (!jwtService.validateToken(refreshToken,user)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid refresh token");
        }

        String newAccessToken = jwtService.generateToken(username, user.getRole(), accessTokenTime); // generate new Access Token

        return ResponseEntity.ok(Map.of("accessToken",newAccessToken));
    }

    @Override
    public void logout() {}
}
