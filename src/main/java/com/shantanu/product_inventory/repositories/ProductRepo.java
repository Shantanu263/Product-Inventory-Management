package com.shantanu.product_inventory.repositories;

import com.shantanu.product_inventory.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProductRepo extends JpaRepository<Product,Integer> {
    Page<Product> findAllByCategory_CategoryId(int categoryId, Pageable p);
    Page<Product> findProductsByNameContainingIgnoreCase(String name, Pageable p);
}
