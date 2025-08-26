package com.shantanu.product_inventory.repositories;

import com.shantanu.product_inventory.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByUser_adminId(Long userId);
}
