package com.shantanu.product_inventory.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.logging.log4j.message.StringFormattedMessage;

@Entity
@Table(name = "Admin")
@Getter
@Setter
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int adminId;

    @Column(unique = true)
    private String username;
    private String password;
}
