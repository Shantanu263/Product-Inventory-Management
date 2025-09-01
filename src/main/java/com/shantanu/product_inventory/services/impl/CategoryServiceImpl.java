package com.shantanu.product_inventory.services.impl;

import com.shantanu.product_inventory.dtos.CategoryDTO;
import com.shantanu.product_inventory.globalExceptionHandlers.ResourceNotFoundException;
import com.shantanu.product_inventory.models.Category;
import com.shantanu.product_inventory.repositories.CategoryRepo;
import com.shantanu.product_inventory.services.CategoryService;
import com.shantanu.product_inventory.services.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;
    private final CloudinaryService cloudinaryService;

    @Override
    public List<Category> getCategories() {
        return categoryRepo.findAll();
    }

    @Override
    public void createCategory(CategoryDTO categoryDTO, MultipartFile image) {
        Category category = modelMapper.map(categoryDTO , Category.class);
        Map<?,?> imageRequest = uploadImage(image);
        category.setImageUrl((String) imageRequest.get("secure_url"));
        category.setImagePublicId((String) imageRequest.get("public_id"));
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
    public Category updateCategory(int id, CategoryDTO categoryDTO, MultipartFile image) {
        Category existingCategory = categoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category","Id",id));

        modelMapper.map(categoryDTO,existingCategory);

        if (image != null && !image.isEmpty()){
            if (existingCategory.getImagePublicId() != null) cloudinaryService.removeImage(existingCategory.getImagePublicId());
            Map<?, ?> imageRequest = uploadImage(image);
            existingCategory.setImageUrl((String) imageRequest.get("secure_url"));
            existingCategory.setImagePublicId((String) imageRequest.get("public_id"));
        }
        return categoryRepo.save(existingCategory);
    }

    @Override
    public Map<?, ?> uploadImage(MultipartFile file){
        return cloudinaryService.uploadImage(file,"Categories");
    }
}
