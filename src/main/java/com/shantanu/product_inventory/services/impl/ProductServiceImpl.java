package com.shantanu.product_inventory.services.impl;

import com.shantanu.product_inventory.dtos.ProductDTO;
import com.shantanu.product_inventory.dtos.ProductResponsePageDTO;
import com.shantanu.product_inventory.globalExceptionHandlers.ResourceNotFoundException;
import com.shantanu.product_inventory.models.Category;
import com.shantanu.product_inventory.models.Product;
import com.shantanu.product_inventory.repositories.CategoryRepo;
import com.shantanu.product_inventory.repositories.ProductRepo;
import com.shantanu.product_inventory.services.CloudinaryService;
import com.shantanu.product_inventory.services.ExcelService;
import com.shantanu.product_inventory.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.Pageable;

import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;
    private final ExcelService excelService;
    private final CloudinaryService cloudinaryService;

    @Override
    public void createProduct(ProductDTO productDTO, MultipartFile image) {
        Category category = categoryRepo.findById(productDTO.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category","Id",productDTO.getCategoryId()));

        Product product = modelMapper.map(productDTO, Product.class);
        product.setId(0);
        product.setCategory(category);
        product.setCreatedDate(new Date());

        Map<?, ?> imageRequest = uploadImage(image);
        product.setImageUrl((String) imageRequest.get("secure_url"));
        product.setImagePublicId((String) imageRequest.get("public_id"));
        productRepo.save(product);
    }

    @Override
    public ProductResponsePageDTO getProducts(int pageNumber, int pageSize, String sortBy, String order) {
        Pageable pageable = ProductService.getPageable(pageNumber, pageSize, sortBy, order);
        Page<Product> page =  productRepo.findAll(pageable);

        return new ProductResponsePageDTO(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Override
    public Product getProductById(int id) {
        return productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product","Id",id));
    }


    @Override
    public Product updateProduct(int id, ProductDTO productDTO, MultipartFile image) {
        Product existingProduct = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product","Id",id));

        existingProduct.setName(productDTO.getName());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setQuantity(productDTO.getQuantity());
        existingProduct.setProductDescription(productDTO.getProductDescription());
        //existingProduct.setImageUrl(productDTO.getImageUrl());

        Category category = categoryRepo.findById(productDTO.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category","Id",productDTO.getCategoryId()));
        existingProduct.setCategory(category);

        if (image != null && !image.isEmpty()) {
            if (existingProduct.getImagePublicId() != null) cloudinaryService.removeImage(existingProduct.getImagePublicId());
            Map<?, ?> imageRequest = uploadImage(image);
            existingProduct.setImageUrl((String) imageRequest.get("secure_url"));
            existingProduct.setImagePublicId((String) imageRequest.get("public_id"));
        }

        return productRepo.save(existingProduct);
    }

    @Override
    public void deleteProduct(int id){
        Product product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product","id",id));
        if (product.getImageUrl() != null && product.getImagePublicId()!=null) System.out.println(cloudinaryService.removeImage(product.getImagePublicId()));
        productRepo.deleteById(id);
    }

    @Override
    public ProductResponsePageDTO getProductsByCategory(int categoryId, int pageNumber, int pageSize, String sortBy, String order) {
        Pageable pageable = ProductService.getPageable(pageNumber, pageSize, sortBy, order);
        Page<Product> page =  productRepo.findAllByCategory_CategoryId(categoryId,pageable);

        return new ProductResponsePageDTO(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Override
    public ProductResponsePageDTO searchProductsByName(String productName, int pageNumber, int pageSize, String sortBy, String order) {
        Pageable pageable = ProductService.getPageable(pageNumber, pageSize, sortBy, order);
        Page<Product> page =  productRepo.findProductsByNameContainingIgnoreCase(productName,pageable);

        return new ProductResponsePageDTO(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Override
    public Map<String,Object> uploadProductsFromExcel(MultipartFile file) {
        if (!excelService.isExcelFile(file)) throw new RuntimeException("Provided file is not an excel file");
        return excelService.uploadProductFromExcel(file);
    }

    @Override
    public Map<?, ?> uploadImage(MultipartFile file){
        return cloudinaryService.uploadImage(file,"Products");
    }
}
