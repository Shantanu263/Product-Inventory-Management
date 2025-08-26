package com.shantanu.product_inventory.services;

public interface ProductRatingService {
    double rateProduct(int productId, int rating, Long userId);
    int getProductRating(int productId, Long userId);
}
