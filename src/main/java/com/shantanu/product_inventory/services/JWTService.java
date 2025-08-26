package com.shantanu.product_inventory.services;

import com.shantanu.product_inventory.models.Admin;
import io.jsonwebtoken.Claims;

import java.util.Date;
import java.util.function.Function;

public interface JWTService {
    String generateToken(String username, String role, long time);

    String extractUsername(String token);

    <T> T extractClaim(String token, Function<Claims, T> claimResolver);

    Claims extractAllClaims(String token);

    boolean validateToken(String token, Admin user);

    boolean isTokenExpired(String token);

    Date extractExpiration(String token);

    String extractRole(String jwtToken);
}
