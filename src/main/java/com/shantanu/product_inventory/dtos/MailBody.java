package com.shantanu.product_inventory.dtos;

import lombok.Builder;

@Builder
public record MailBody(String to, String subject, String text) {
}
