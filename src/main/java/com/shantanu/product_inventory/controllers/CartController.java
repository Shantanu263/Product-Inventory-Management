package com.shantanu.product_inventory.controllers;

import com.shantanu.product_inventory.models.CartItem;
import com.shantanu.product_inventory.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public CartItem addToCart(@RequestParam int productId, @RequestParam int quantity, @RequestAttribute Long userId) {
        return cartService.addToCart(userId, productId, quantity);
    }

    @GetMapping
    public List<CartItem> getCart(@RequestAttribute Long userId) {
        return cartService.getCartItems(userId);
    }

    @DeleteMapping("/{itemId}")
    public void removeItem(@PathVariable Long itemId, @RequestAttribute Long userId) {
        cartService.removeCartItem(itemId, userId);
    }

    @PutMapping("/{itemId}")
    public CartItem updateQuantity(@PathVariable Long itemId, @RequestParam int quantity, @RequestAttribute Long userId) {
        return cartService.updateQuantity(itemId, quantity, userId);
    }
}

