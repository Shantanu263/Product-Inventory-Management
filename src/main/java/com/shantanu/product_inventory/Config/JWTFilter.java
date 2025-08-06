package com.shantanu.product_inventory.Config;

import com.shantanu.product_inventory.Model.Admin;
import com.shantanu.product_inventory.Repository.AdminRepo;
import com.shantanu.product_inventory.Service.JWTService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@RequiredArgsConstructor
@Component
public class JWTFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final AdminRepo adminRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwtToken = null;

        // Check if Authorization header is present and starts with Bearer
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwtToken = authHeader.substring(7); // remove "Bearer "

            try {
                username = jwtService.extractUsername(jwtToken);
            } catch (ExpiredJwtException e) {
                logger.warn("JWT Token has expired");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
                return;
            } catch (Exception e) {
                logger.warn("Unable to parse JWT Token");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return;
            }
        }

        // If username is found and not already authenticated
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Admin user = adminRepo.findByUsername(username).orElse(null);

            if (user != null && jwtService.validateToken(jwtToken, user)) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the authentication in the SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}


