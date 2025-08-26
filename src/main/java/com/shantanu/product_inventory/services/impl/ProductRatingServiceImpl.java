package com.shantanu.product_inventory.services.impl;

import com.shantanu.product_inventory.globalExceptionHandlers.ResourceNotFoundException;
import com.shantanu.product_inventory.models.Admin;
import com.shantanu.product_inventory.models.Product;
import com.shantanu.product_inventory.models.ProductRating;
import com.shantanu.product_inventory.repositories.AdminRepo;
import com.shantanu.product_inventory.repositories.ProductRatingRepo;
import com.shantanu.product_inventory.repositories.ProductRepo;
import com.shantanu.product_inventory.services.ProductRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProductRatingServiceImpl implements ProductRatingService {
    private final ProductRepo productRepo;
    private final ProductRatingRepo productRatingRepo;
    private final AdminRepo adminRepo;

    @Override
    public double rateProduct(int productId, int rating, Long userId) {
        Admin user = adminRepo.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User","User Id",userId));
        Product product = productRepo.findById(productId).orElseThrow(()-> new ResourceNotFoundException("Product","Product Id",productId));
        ProductRating productRating = productRatingRepo.findByProductAndUser(product,user).orElse(new ProductRating(null,rating,user,product));

        productRating.setRating(rating);
        productRatingRepo.save(productRating);

        List<ProductRating> ratings = productRatingRepo.findAll()
                .stream()
                .filter(r -> r.getProduct().equals(product))
                .toList();

        double avg = ratings.stream()
                .mapToInt(ProductRating::getRating)
                .average()
                .orElse(0.0);

        product.setAverageRating(avg);
        productRepo.save(product);

        return avg;
    }

    @Override
    public int getProductRating(int productId, Long userId) {
        Admin user = adminRepo.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User","User Id",userId));
        Product product = productRepo.findById(productId).orElseThrow(()-> new ResourceNotFoundException("Product","Product Id",productId));
        ProductRating rating = productRatingRepo.findByProductAndUser(product,user).orElseThrow(()-> new ResourceNotFoundException("rating","for Product and User",productId));
        return rating.getRating();
    }
}
