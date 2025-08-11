package com.shantanu.product_inventory.services;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface ExcelService {
    // is the file an Excel file or not
    boolean isExcelFile(MultipartFile file);

    // upload products from excel file
    Map<String, Object> uploadProductFromExcel(MultipartFile file);
}
