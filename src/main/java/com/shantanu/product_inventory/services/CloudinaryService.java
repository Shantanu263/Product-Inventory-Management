package com.shantanu.product_inventory.services;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface CloudinaryService {
    boolean isImageFile(MultipartFile file);

    Map<?, ?> uploadImage(MultipartFile file, String folderName);
}
