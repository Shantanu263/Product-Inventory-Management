package com.shantanu.product_inventory.controllers;

import com.shantanu.product_inventory.models.Order;
import com.shantanu.product_inventory.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public Order placeOrder(@RequestAttribute Long userId) {
        return orderService.placeOrder(userId);
    }

    @GetMapping
    public List<Order> getOrders(@RequestAttribute Long userId) {
        return orderService.getOrders(userId);
    }

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id, @RequestAttribute Long userId) {
        return orderService.getOrderById(id, userId);
    }
}

