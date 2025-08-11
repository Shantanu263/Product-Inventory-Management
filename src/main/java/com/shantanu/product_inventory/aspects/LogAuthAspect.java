package com.shantanu.product_inventory.aspects;

import com.shantanu.product_inventory.dtos.AdminDTO;
import com.shantanu.product_inventory.models.Admin;
import com.shantanu.product_inventory.services.AuthLogService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class LogAuthAspect {
    private final AuthLogService authLogService;

    // After successful login
    @AfterReturning("execution(* com.shantanu.product_inventory.services.impl.AuthServiceImpl.login(..))")
    public void logLogin(JoinPoint joinPoint) {
        AdminDTO dto = (AdminDTO) joinPoint.getArgs()[0];
        String username = dto.getUsername();
        authLogService.logAuthAction(username, "LOGIN");
    }

    // After logout
    @AfterReturning("execution(* com.shantanu.product_inventory.controllers.AuthController.logout(..))")
    public void logLogout() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null && auth.getPrincipal() instanceof Admin)
                ? ((Admin) auth.getPrincipal()).getUsername()
                : "UNKNOWN";

        authLogService.logAuthAction(username, "LOGOUT");
    }

}
