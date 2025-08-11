package com.shantanu.product_inventory.services.impl;

import com.shantanu.product_inventory.models.AuthLog;
import com.shantanu.product_inventory.repositories.AuthLogRepo;
import com.shantanu.product_inventory.services.AuthLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthLogServiceImpl implements AuthLogService {
    private final AuthLogRepo authLogRepo;

    @Override
    public void logAuthAction(String username, String action) {
        AuthLog log = AuthLog.builder()
                            .username(username)
                            .action(action)
                            .timestamp(LocalDateTime.now())
                            .build();

        authLogRepo.save(log);
    }
}
