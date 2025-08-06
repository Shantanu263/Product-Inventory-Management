package com.shantanu.product_inventory.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int categoryId;
    private String categoryName;
    private String categoryDescription;
    private String imageUrl;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Product> products;

}
