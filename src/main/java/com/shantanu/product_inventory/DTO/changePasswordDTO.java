package com.shantanu.product_inventory.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class changePasswordDTO {
    private String oldPassword;
    private String newPassword;
}
