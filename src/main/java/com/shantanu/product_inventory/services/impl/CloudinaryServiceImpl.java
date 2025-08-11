package com.shantanu.product_inventory.services.impl;

import com.cloudinary.Cloudinary;
import com.shantanu.product_inventory.services.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {
    private final Cloudinary cloudinary;

    @Override
    public boolean isImageFile(MultipartFile file) {
        String fileType = file.getContentType();
        return  (fileType != null && fileType.startsWith("image/"));
    }

    @Override
    public Map<?, ?> uploadImage(MultipartFile file, String folderName) {
        try {
            return cloudinary.uploader().upload(file.getBytes(), Map.of("asset_folder",folderName));
        } catch (IOException e) {
            throw new RuntimeException("Error reading image file.");
        }
    }
}
