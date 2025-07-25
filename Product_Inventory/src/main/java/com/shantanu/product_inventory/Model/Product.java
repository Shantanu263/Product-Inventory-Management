package com.shantanu.product_inventory.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private long price;
    private int quantity;
    private Date createdDate;

    @ManyToOne
    @JoinColumn(name = "categoryId")
    private Category category;

}
