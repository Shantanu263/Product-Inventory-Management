package com.shantanu.product_inventory.services;

import com.shantanu.product_inventory.dtos.ProductDTO;
import com.shantanu.product_inventory.dtos.ProductResponsePageDTO;
import com.shantanu.product_inventory.models.Product;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface ProductService {
    static Pageable getPageable(int pageNumber, int pageSize, String sortBy, String order) {
        Pageable pageable;
        if (order.equals("asc")) pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy).ascending());
        else pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy).descending());
        return pageable;
    }

    void createProduct(ProductDTO productDTO, MultipartFile image);

    ProductResponsePageDTO getProducts(int pageNumber, int pageSize, String sortBy, String order);

    Product getProductById(int id);

    Product updateProduct(int id, ProductDTO productDTO, MultipartFile image);

    void deleteProduct(int id);

    ProductResponsePageDTO getProductsByCategory(int categoryId, int pageNumber, int pageSize, String sortBy, String order);

    ProductResponsePageDTO searchProductsByName(String productName, int pageNumber, int pageSize, String sortBy, String order);

    Map<String, Object> uploadProductsFromExcel(MultipartFile file);

    Map<?, ?> uploadImage(MultipartFile file);
}
