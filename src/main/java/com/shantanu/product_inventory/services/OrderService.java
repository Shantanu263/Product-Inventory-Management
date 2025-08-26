package com.shantanu.product_inventory.services;

import com.shantanu.product_inventory.models.Order;

import java.util.List;

public interface OrderService {
    Order placeOrder(Long userId);
    List<Order> getOrders(Long userId);
    Order getOrderById(Long orderId, Long userId);
}
