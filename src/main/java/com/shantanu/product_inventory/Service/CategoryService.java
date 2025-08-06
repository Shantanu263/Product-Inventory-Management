package com.shantanu.product_inventory.Service;

import com.shantanu.product_inventory.DTO.CategoryDTO;
import com.shantanu.product_inventory.GlobalExceptionHandler.ResourceNotFoundException;
import com.shantanu.product_inventory.Model.Category;
import com.shantanu.product_inventory.Repository.CategoryRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;

    public List<Category> getCategories() {
        return categoryRepo.findAll();
    }

    public void createCategory(CategoryDTO categoryDTO) {
        Category category = modelMapper.map(categoryDTO , Category.class);
        categoryRepo.save(category);
    }

    public Category getCategoryById(int id) {
        return categoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category","Id",id));
    }

    public void deleteCategory(int id) {
        categoryRepo.deleteById(id);
    }

    public Category updateCategory(int id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category","Id",id));

        modelMapper.map(categoryDTO,existingCategory);
        return categoryRepo.save(existingCategory);
    }
}
