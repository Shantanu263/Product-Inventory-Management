package com.shantanu.product_inventory.Repository;

import com.shantanu.product_inventory.Model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepo extends JpaRepository<Admin, Integer> {
    boolean existsByUsername(String username);
    Optional<Admin> findByUsername(String username);
}
