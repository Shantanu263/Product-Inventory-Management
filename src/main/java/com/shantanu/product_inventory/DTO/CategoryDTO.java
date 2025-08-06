package com.shantanu.product_inventory.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryDTO {
    @NotBlank(message = "Category Name should not be empty")
    private String categoryName;

    @NotBlank(message = "Category Description should not be empty")
    @Size(max = 500, message = "Description should not exceed 500 characters")
    private String categoryDescription;

    //@NotBlank(message = "Image URL is required")
    private String imageUrl;
}
