package com.shantanu.product_inventory.services;

import com.shantanu.product_inventory.dtos.CategoryDTO;
import com.shantanu.product_inventory.models.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getCategories();

    void createCategory(CategoryDTO categoryDTO);

    Category getCategoryById(int id);

    void deleteCategory(int id);

    Category updateCategory(int id, CategoryDTO categoryDTO);
}
