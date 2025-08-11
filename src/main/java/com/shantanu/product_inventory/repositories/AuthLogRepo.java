package com.shantanu.product_inventory.repositories;

import com.shantanu.product_inventory.models.AuthLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthLogRepo extends JpaRepository<AuthLog,Long> {

}
