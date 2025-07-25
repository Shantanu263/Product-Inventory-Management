package com.shantanu.product_inventory.Repository;

import com.shantanu.product_inventory.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product,Integer> {
    List<Product> findAllByCategory_CategoryId(int categoryId);
    List<Product> findProductsByNameContainingIgnoreCase(String name);
}
