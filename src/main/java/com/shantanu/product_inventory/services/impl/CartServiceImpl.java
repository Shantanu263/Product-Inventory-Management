package com.shantanu.product_inventory.services.impl;

import com.shantanu.product_inventory.models.CartItem;
import com.shantanu.product_inventory.repositories.AdminRepo;
import com.shantanu.product_inventory.repositories.CartItemRepo;
import com.shantanu.product_inventory.repositories.ProductRepo;
import com.shantanu.product_inventory.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemRepo cartRepo;
    private final ProductRepo productRepo;
    private final AdminRepo userRepo;

    @Override
    public CartItem addToCart(Long userId, int productId, int quantity) {
        var user = userRepo.findById(userId).orElseThrow();
        var product = productRepo.findById(productId).orElseThrow();

        CartItem item = new CartItem();
        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(quantity);

        return cartRepo.save(item);
    }

    @Override
    public List<CartItem> getCartItems(Long userId) {
        return cartRepo.findByUser_adminId(userId);
    }

    @Override
    public void removeCartItem(Long itemId, Long userId) {
        var item = cartRepo.findById(itemId).orElseThrow();
        if (!item.getUser().getAdminId().equals(userId)) throw new RuntimeException("Unauthorized");
        cartRepo.delete(item);
    }

    @Override
    public CartItem updateQuantity(Long itemId, int quantity, Long userId) {
        var item = cartRepo.findById(itemId).orElseThrow();
        if (!item.getUser().getAdminId().equals(userId)) throw new RuntimeException("Unauthorized");
        item.setQuantity(quantity);
        return cartRepo.save(item);
    }

    @Override
    public void clearCart(Long userId) {
        cartRepo.deleteByUser_adminId(userId);
    }
}

