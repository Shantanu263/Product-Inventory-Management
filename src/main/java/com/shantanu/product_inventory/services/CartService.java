package com.shantanu.product_inventory.services;

import com.shantanu.product_inventory.models.CartItem;

import java.util.List;

public interface CartService {
    CartItem addToCart(Long userId, int productId, int quantity);
    List<CartItem> getCartItems(Long userId);
    void removeCartItem(Long itemId, Long userId);
    CartItem updateQuantity(Long itemId, int quantity, Long userId);
    void clearCart(Long userId);
}
