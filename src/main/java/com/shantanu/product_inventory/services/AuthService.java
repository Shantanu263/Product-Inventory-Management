package com.shantanu.product_inventory.services;

import com.shantanu.product_inventory.dtos.AdminDTO;
import com.shantanu.product_inventory.dtos.changePasswordDTO;
import com.shantanu.product_inventory.models.Admin;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AuthService {
    void registerUser(AdminDTO adminDTO);

    Admin fetchUserDetails();

    ResponseEntity<?> login(AdminDTO adminDTO);

    ResponseEntity<?> changePassword(changePasswordDTO request);

    ResponseEntity<?> refresh(Map<String, String> request);

    void logout();
}
