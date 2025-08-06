package com.shantanu.product_inventory.Controller;

import com.shantanu.product_inventory.DTO.ProductDTO;
import com.shantanu.product_inventory.DTO.ProductResponsePageDTO;
import com.shantanu.product_inventory.Model.Product;
import com.shantanu.product_inventory.Service.ExcelService;
import com.shantanu.product_inventory.Service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @PostMapping
    public ResponseEntity<String> createProduct(@RequestPart @Valid ProductDTO productDTO){
        productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Product created successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id){
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable int id, @RequestBody @Valid ProductDTO productDTO){
        return ResponseEntity.ok(productService.updateProduct(id,productDTO));
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
        if (!ExcelService.isExcelFile(file)) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Provided file is not an Excel file.");
        try {
            Map<String,Object> result = productService.uploadProductsFromExcel(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Upload failed: " + e.getMessage());
        }
    }

}
