package com.shantanu.product_inventory.controllers;

import com.shantanu.product_inventory.services.ProductRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/product-rating")
public class ProductRatingController {
    private final ProductRatingService productRatingService;

    @PostMapping("/{productId}/rate")
    public ResponseEntity<?> rateProduct(@PathVariable int productId, @RequestParam(name = "rating") int rating, @RequestAttribute Long userId){
        return ResponseEntity.ok("Product rated successfully. New average rating of the product: " + productRatingService.rateProduct(productId,rating,userId));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductRating(@PathVariable int productId, @RequestAttribute Long userId){
        return ResponseEntity.ok("Rating given by User with id "+userId+" is : "+productRatingService.getProductRating(productId,userId));
    }
}
