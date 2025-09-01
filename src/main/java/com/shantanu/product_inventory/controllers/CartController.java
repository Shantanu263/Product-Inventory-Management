package com.shantanu.product_inventory.controllers;

import com.shantanu.product_inventory.models.CartItem;
import com.shantanu.product_inventory.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestParam int productId, @RequestParam int quantity, @RequestAttribute Long userId) {
        return ResponseEntity.ok(cartService.addToCart(userId, productId, quantity));
    }

    @GetMapping
    public ResponseEntity<?> getCart(@RequestAttribute Long userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> removeItem(@PathVariable Long itemId, @RequestAttribute Long userId) {
        cartService.removeCartItem(itemId, userId);
        return ResponseEntity.ok("Cart Item with item id"+itemId+" removed");
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long itemId, @RequestParam int quantity, @RequestAttribute Long userId) {
        return ResponseEntity.ok(cartService.updateQuantity(itemId, quantity, userId));
    }
}

