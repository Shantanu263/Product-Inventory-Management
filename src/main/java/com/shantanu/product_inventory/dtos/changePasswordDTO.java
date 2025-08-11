package com.shantanu.product_inventory.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class changePasswordDTO {
    private String oldPassword;
    private String newPassword;
}
