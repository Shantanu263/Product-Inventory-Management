//package com.shantanu.product_inventory.Service;
//
//import com.shantanu.product_inventory.Model.Admin;
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import org.springframework.stereotype.Service;
//
//import java.util.Date;
//import java.util.function.Function;
//
//@Service
//public class JWTService {
//    private final String SECRET = "secretkey";
//
//    public String generateToken(String username) {
//        return Jwts
//                .builder()
//                .subject(username)
//                .issuedAt(new Date())
//                .expiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
//                .signWith(SignatureAlgorithm.HS256, SECRET)
//                .compact();
//    }
//
//    public String extractUsername(String token) {
//        return extractClaim(token, Claims::getSubject);     // extract the username from jwt token
//    }
//
//    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
//        final Claims claims = extractAllClaims(token);
//        return claimResolver.apply(claims);
//    }
//
//    private Claims extractAllClaims(String token) {
//        return Jwts.parser()
//                .verifyWith(getKey())
//                .build()
//                .parseSignedClaims(token)
//                .getPayload();
//    }
//
//    public boolean validateToken(String token, Admin user) {
//        final String username = extractUsername(token);
//        return (username.equals(user.getUsername()) && !isTokenExpired(token));
//    }
//
//    private boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    private Date extractExpiration(String token) {
//        return extractClaim(token, Claims::getExpiration);
//    }
//
//
//}

package com.shantanu.product_inventory.Service;

import com.shantanu.product_inventory.Model.Admin;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JWTService {

    @Value("${jwt.secret:IhkeNrrgQ/upglKmsbJ4lcvXbE4HLNj621gwMwjL1GThDh/kbctqhxcG/oBtJVbG}")
    private String SECRET;

    public String generateToken(String username) {
        return Jwts
                .builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);     // extract the username from jwt token
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public boolean validateToken(String token, Admin user) {
        final String username = extractUsername(token);
        return (username.equals(user.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
