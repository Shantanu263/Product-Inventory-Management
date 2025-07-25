package com.shantanu.product_inventory.Service;

import com.shantanu.product_inventory.DTO.ProductDTO;
import com.shantanu.product_inventory.GlobalExceptionHandler.ResourceNotFoundException;
import com.shantanu.product_inventory.Model.Category;
import com.shantanu.product_inventory.Model.Product;
import com.shantanu.product_inventory.Repository.CategoryRepo;
import com.shantanu.product_inventory.Repository.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.Pageable;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;
    private final ExcelService excelService;

    public void createProduct(ProductDTO productDTO) {
        Category category = categoryRepo.findById(productDTO.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category","Id",productDTO.getCategoryId()));

        Product product = modelMapper.map(productDTO, Product.class);
        product.setId(0);
        product.setCategory(category);
        product.setCreatedDate(new Date());
        productRepo.save(product);
    }

    public List<Product> getProducts(int pageNumber, int pageSize, String sortBy, String order) {
        Pageable pageable;
        if (order.equals("asc"))  pageable = PageRequest.of(pageNumber,pageSize,Sort.by(sortBy).ascending());
        else pageable = PageRequest.of(pageNumber,pageSize,Sort.by(sortBy).descending());
        Page<Product> page=  productRepo.findAll(pageable);
        return page.getContent();
    }

    public Product getProductById(int id) {
        return productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product","Id",id));
    }


    public Product updateProduct(int id, ProductDTO productDTO) {
        Product existingProduct = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product","Id",id));

        existingProduct.setName(productDTO.getName());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setQuantity(productDTO.getQuantity());

        Category category = categoryRepo.findById(productDTO.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category","Id",productDTO.getCategoryId()));
        existingProduct.setCategory(category);

        return productRepo.save(existingProduct);
    }

    public void deleteProduct(int id){
        productRepo.deleteById(id);
    }

    public List<Product> getProductsByCategory(int categoryId) {
        return productRepo.findAllByCategory_CategoryId(categoryId);
    }

    public List<Product> searchProductByName(String productName) {
        return productRepo.findProductsByNameContainingIgnoreCase(productName);
    }

    public Map<String,Object> uploadProductsFromExcel(MultipartFile file) {
        return excelService.uploadProductFromExcel(file);
    }
}
