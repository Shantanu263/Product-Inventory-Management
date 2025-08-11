package com.shantanu.product_inventory.services.impl;

import com.shantanu.product_inventory.dtos.CategoryDTO;
import com.shantanu.product_inventory.globalExceptionHandlers.ResourceNotFoundException;
import com.shantanu.product_inventory.models.Category;
import com.shantanu.product_inventory.repositories.CategoryRepo;
import com.shantanu.product_inventory.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;

    @Override
    public List<Category> getCategories() {
        return categoryRepo.findAll();
    }

    @Override
    public void createCategory(CategoryDTO categoryDTO) {
        Category category = modelMapper.map(categoryDTO , Category.class);
        categoryRepo.save(category);
    }

    @Override
    public Category getCategoryById(int id) {
        return categoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category","Id",id));
    }

    @Override
    public void deleteCategory(int id) {
        categoryRepo.deleteById(id);
    }

    @Override
    public Category updateCategory(int id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category","Id",id));

        modelMapper.map(categoryDTO,existingCategory);
        return categoryRepo.save(existingCategory);
    }
}
