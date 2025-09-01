package com.shantanu.product_inventory.controllers;

import com.shantanu.product_inventory.dtos.CategoryDTO;
import com.shantanu.product_inventory.models.Category;
import com.shantanu.product_inventory.services.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categories = categoryService.getCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<String> createCategory(@RequestPart("categoryDTO") @Valid CategoryDTO categoryDTO,
                                                 @RequestPart("image")MultipartFile image) {
        categoryService.createCategory(categoryDTO,image);
        return ResponseEntity.status(HttpStatus.CREATED).body("Category created successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable int id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable int id,
                                                   @RequestPart("categoryDTO") @Valid CategoryDTO categoryDTO,
                                                   @RequestPart(value = "image", required = false) MultipartFile image) {
        Category updatedCategory = categoryService.updateCategory(id, categoryDTO,image);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable int id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted successfully");
    }
}

