package com.shantanu.product_inventory.controllers;

import com.shantanu.product_inventory.dtos.ProductDTO;
import com.shantanu.product_inventory.dtos.ProductResponsePageDTO;
import com.shantanu.product_inventory.models.Product;
import com.shantanu.product_inventory.services.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ProductResponsePageDTO> getProducts(
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "15", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(value = "order", defaultValue = "asc", required = false) String order
    ){
        return ResponseEntity.ok(productService.getProducts(pageNumber,pageSize,sortBy,order));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createProduct(@RequestPart("productDTO") @Valid ProductDTO productDTO, //application/json
                                                @RequestPart("image") MultipartFile image){              //multipart/form-data
        productService.createProduct(productDTO,image);
        return ResponseEntity.status(HttpStatus.CREATED).body("Product created successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id){
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable int id, @RequestPart @Valid ProductDTO productDTO,
                                                 @RequestPart(required = false) MultipartFile image){
        return ResponseEntity.ok(productService.updateProduct(id,productDTO,image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id){
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product Deleted Successfully");
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ProductResponsePageDTO> getProductsByCategory(
            @PathVariable int categoryId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "15", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(value = "order", defaultValue = "asc", required = false) String order
    ){
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId,pageNumber,pageSize,sortBy,order));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProductsByName(
            @RequestParam( value = "name") String productName,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "15", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(value = "order", defaultValue = "asc", required = false) String order
            ){
        ProductResponsePageDTO products = productService.searchProductsByName(productName,pageNumber,pageSize,sortBy,order);

        if (products.getContent().isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No matches found");
        return ResponseEntity.ok(products);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadExcel(@RequestParam("file") MultipartFile file) {
        try {
            Map<String,Object> result = productService.uploadProductsFromExcel(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Upload failed: " + e.getMessage());
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file){
        return ResponseEntity.ok(productService.uploadImage(file));
    }
}
