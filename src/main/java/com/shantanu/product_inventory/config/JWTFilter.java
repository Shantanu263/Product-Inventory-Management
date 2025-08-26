package com.shantanu.product_inventory.config;

import com.shantanu.product_inventory.globalExceptionHandlers.ResourceNotFoundException;
import com.shantanu.product_inventory.models.Admin;
import com.shantanu.product_inventory.repositories.AdminRepo;
import com.shantanu.product_inventory.services.JWTService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Component
public class JWTFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final AdminRepo adminRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwtToken = null;
        String role = null;

        // Check if Authorization header is present and starts with Bearer
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwtToken = authHeader.substring(7); // remove "Bearer "

            try {
                username = jwtService.extractUsername(jwtToken);
                role = jwtService.extractRole(jwtToken);
                request.setAttribute("username", username);
                request.setAttribute("role", role);
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
            final String finalUser = username;
            Admin user = adminRepo.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("user","username",finalUser));
            request.setAttribute("userId", user.getAdminId());

            if (jwtService.validateToken(jwtToken, user)) {
                List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user, null, authorities);

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the authentication in the SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}


