package com.shantanu.product_inventory.Model;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private Date createdDate;

    private String imageUrl;

//    private String imageName;
//    private String imageType;
//    @Lob
//    private Byte[] imageData;

    @ManyToOne
    @JoinColumn(name = "categoryId")
    private Category category;

}
