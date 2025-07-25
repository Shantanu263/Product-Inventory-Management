package com.shantanu.product_inventory.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDTO {
    @NotBlank(message = "Name should not be empty")
    private String name;

    @Min(value = 1, message = "Price should be greater than 1")
    private long price;

    @Min(value = 1,message = "Minimum quantity must be 1")
    private int quantity;

    @NotNull(message = "Product Category not mentioned")
    private int categoryId;
}

