package com.shantanu.product_inventory.services.impl;

import com.shantanu.product_inventory.globalExceptionHandlers.ResourceNotFoundException;
import com.shantanu.product_inventory.models.*;
import com.shantanu.product_inventory.repositories.AdminRepo;
import com.shantanu.product_inventory.repositories.CartItemRepo;
import com.shantanu.product_inventory.repositories.OrderRepo;
import com.shantanu.product_inventory.repositories.ProductRepo;
import com.shantanu.product_inventory.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepo orderRepo;
    private final CartItemRepo cartRepo;
    private final AdminRepo userRepo;
    private final ProductRepo productRepo;

    @Transactional
    @Override
    public Order placeOrder(Long userId) {
        Admin user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("user", "user Id", userId));

        List<CartItem> cartItems = cartRepo.findByUser_adminId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        //Check stock availability first
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");

        // Create order items and update product stock
        List<OrderItem> orderItems = cartItems.stream().map(ci -> {
            Product product = ci.getProduct();

            // Reduce stock
            product.setQuantity(product.getQuantity() - ci.getQuantity());
            productRepo.save(product);

            OrderItem oi = new OrderItem();
            oi.setProduct(product);
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(product.getPrice());
            oi.setOrder(order);
            return oi;
        }).toList();

        double total = orderItems.stream()
                .mapToDouble(oi -> oi.getQuantity() * oi.getPrice())
                .sum();

        order.setItems(orderItems);
        order.setTotalAmount(total);

        Order savedOrder = orderRepo.save(order);

        // Clear cart after placing order
        cartRepo.deleteByUser_adminId(userId);

        return savedOrder;
    }

    @Override
    public List<Order> getOrders(Long userId) {
        return orderRepo.findByUser_adminId(userId).orElseThrow(()-> new ResourceNotFoundException("Orders","userID",userId));
    }

    @Override
    public Order getOrderById(Long orderId, Long userId) {
        Order order = orderRepo.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order","id",orderId));
        if (!order.getUser().getAdminId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        return order;
    }
}
