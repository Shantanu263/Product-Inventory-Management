package com.shantanu.product_inventory.Repository;

import com.shantanu.product_inventory.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepo extends JpaRepository<Category,Integer> {

}
