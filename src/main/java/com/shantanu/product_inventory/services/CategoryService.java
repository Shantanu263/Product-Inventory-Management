package com.shantanu.product_inventory.services;

import com.shantanu.product_inventory.dtos.CategoryDTO;
import com.shantanu.product_inventory.models.Category;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface CategoryService {
    List<Category> getCategories();

    void createCategory(CategoryDTO categoryDTO, MultipartFile image);

    Category getCategoryById(int id);

    void deleteCategory(int id);

    Category updateCategory(int id, CategoryDTO categoryDTO, MultipartFile image);

    Map<?, ?> uploadImage(MultipartFile file);
}
