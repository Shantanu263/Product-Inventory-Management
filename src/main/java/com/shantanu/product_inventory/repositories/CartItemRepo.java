package com.shantanu.product_inventory.repositories;

import com.shantanu.product_inventory.models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser_adminId(Long userId);

    @Transactional
    @Modifying
    void deleteByUser_adminId(Long userId);
}
