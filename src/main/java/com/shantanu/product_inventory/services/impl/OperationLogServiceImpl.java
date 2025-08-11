package com.shantanu.product_inventory.services.impl;

import com.shantanu.product_inventory.models.OperationLog;
import com.shantanu.product_inventory.repositories.OperationLogRepo;
import com.shantanu.product_inventory.services.OperationLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OperationLogServiceImpl implements OperationLogService {

    private final OperationLogRepo operationLogRepo;

    @Override
    public void logOperation(String username, String operation, String entity, String details) {
        OperationLog log = OperationLog.builder()
                .username(username)
                .operation(operation)
                .entity(entity)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();

        operationLogRepo.save(log);
    }
}
