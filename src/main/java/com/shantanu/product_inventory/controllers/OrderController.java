package com.shantanu.product_inventory.controllers;

import com.shantanu.product_inventory.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestAttribute Long userId) {
        return ResponseEntity.ok(orderService.placeOrder(userId));
    }

    @GetMapping
    public ResponseEntity<?> getOrders(@RequestAttribute Long userId) {
        return ResponseEntity.ok(orderService.getOrders(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id, @RequestAttribute Long userId) {
        return ResponseEntity.ok(orderService.getOrderById(id, userId));
    }
}

