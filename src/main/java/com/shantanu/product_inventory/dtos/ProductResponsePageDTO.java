package com.shantanu.product_inventory.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import com.shantanu.product_inventory.models.Product;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductResponsePageDTO {
    private List<Product> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean lastPage;
}
