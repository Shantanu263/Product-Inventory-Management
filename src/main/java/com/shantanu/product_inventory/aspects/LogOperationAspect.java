package com.shantanu.product_inventory.aspects;

import com.shantanu.product_inventory.models.Admin;
import com.shantanu.product_inventory.services.OperationLogService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class LogOperationAspect {

    private final OperationLogService operationLogService;


    // pointcuts for Create, Update, Delete methods
    @Pointcut("execution(* com.shantanu.product_inventory.services.impl.ProductServiceImpl.create*(..)) || execution(* com.shantanu.product_inventory.services.impl.CategoryServiceImpl.create*(..))")
    public void createMethods() {}

    @Pointcut("execution(* com.shantanu.product_inventory.services.impl.ProductServiceImpl.upload*(..)) || execution(* com.shantanu.product_inventory.services.impl.CategoryServiceImpl.upload*(..))")
    public void uploadMethods() {}

    @Pointcut("execution(* com.shantanu.product_inventory.services.impl.ProductServiceImpl.update*(..)) || execution(* com.shantanu.product_inventory.services.impl.CategoryServiceImpl.update*(..))")
    public void updateMethods() {}

    @Pointcut("execution(* com.shantanu.product_inventory.services.impl.ProductServiceImpl.delete*(..)) || execution(* com.shantanu.product_inventory.services.impl.CategoryServiceImpl.delete*(..))")
    public void deleteMethods() {}

    @AfterReturning("createMethods()")
    public void logCreate(JoinPoint joinPoint) {
        logOperation(joinPoint, "CREATE");
    }

    @AfterReturning("uploadMethods()")
    public void logUpload(JoinPoint joinPoint) {
        logOperation(joinPoint, "UPLOAD");
    }

    @AfterReturning("updateMethods()")
    public void logUpdate(JoinPoint joinPoint) {
        logOperation(joinPoint, "UPDATE");
    }

    @AfterReturning("deleteMethods()")
    public void logDelete(JoinPoint joinPoint) {
        logOperation(joinPoint, "DELETE");
    }

    private void logOperation(JoinPoint joinPoint, String operation) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null && auth.getPrincipal() instanceof Admin)
                ? ((Admin) auth.getPrincipal()).getUsername()
                : "UNKNOWN";

        String entityName = joinPoint.getTarget().getClass().getSimpleName()
                .replace("ServiceImpl", "");

        String details = joinPoint.getArgs().length > 0 ? joinPoint.getArgs()[0].toString() : "";

        operationLogService.logOperation(username, operation, entityName, details);
    }
}
