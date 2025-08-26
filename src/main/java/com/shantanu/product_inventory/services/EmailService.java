package com.shantanu.product_inventory.services;

import com.shantanu.product_inventory.dtos.MailBody;

public interface EmailService {
    void sendSimpleMessage(MailBody mailBody);
}
