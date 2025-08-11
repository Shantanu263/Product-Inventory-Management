package com.shantanu.product_inventory.repositories;

import com.shantanu.product_inventory.models.OperationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OperationLogRepo extends JpaRepository<OperationLog, Long> {
}
