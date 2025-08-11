package com.shantanu.product_inventory.services;

public interface OperationLogService {
    void logOperation(String username, String operation, String entity, String details);
}
