package com.shantanu.product_inventory.repositories;

import com.shantanu.product_inventory.models.Admin;
import com.shantanu.product_inventory.models.Product;
import com.shantanu.product_inventory.models.ProductRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRatingRepo extends JpaRepository<ProductRating, Long> {
    Optional<ProductRating> findByProductAndUser(Product product, Admin user);
}

