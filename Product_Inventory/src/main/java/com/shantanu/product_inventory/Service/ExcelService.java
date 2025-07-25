package com.shantanu.product_inventory.Service;

import com.shantanu.product_inventory.DTO.ProductDTO;
import com.shantanu.product_inventory.Model.Category;
import com.shantanu.product_inventory.Model.Product;
import com.shantanu.product_inventory.Repository.CategoryRepo;
import com.shantanu.product_inventory.Repository.ProductRepo;
import jakarta.validation.ConstraintViolation;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import jakarta.validation.Validator;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExcelService {
    private final CategoryRepo categoryRepo;
    private final Validator validator;
    private final ModelMapper modelMapper;
    private final ProductRepo productRepo;

    // is the file an Excel file or not
    public static boolean isExcelFile(MultipartFile file){
        String fileType = file.getContentType();
        return (Objects.equals(fileType, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
    }

    // upload products from excel file
    public Map<String,Object> uploadProductFromExcel(MultipartFile file){
        List<String> errors = new ArrayList<>();
        int rowNum = 1;
        int successCount = 0;

        try {
            XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
            XSSFSheet sheet = workbook.getSheet("data");

            for (Row row : sheet){
                if (rowNum == 1) {
                    rowNum++;
                    continue;
                }
                try {
                    List<String> rowErrors = new ArrayList<>();
                    ProductDTO productDTO = new ProductDTO();

                    // Validate Name
                    Cell nameCell = row.getCell(0);
                    if (nameCell == null || nameCell.getCellType() == CellType.BLANK || nameCell.getCellType() != CellType.STRING) {
                        rowErrors.add("Name is invalid or blank");
                    }
                    else productDTO.setName(nameCell.getStringCellValue());

                    // Validate Price
                    Cell priceCell = row.getCell(1);
                    if (priceCell == null || priceCell.getCellType() == CellType.BLANK || priceCell.getCellType() != CellType.NUMERIC) {
                        rowErrors.add("Price is invalid or blank");
                    }
                    else productDTO.setPrice((long) priceCell.getNumericCellValue());

                    // Validate Quantity
                    Cell quantityCell = row.getCell(2);
                    if (quantityCell == null || quantityCell.getCellType() == CellType.BLANK || quantityCell.getCellType() != CellType.NUMERIC) {
                        rowErrors.add("Quantity is Invalid or blank");
                    }
                    else productDTO.setQuantity((int) quantityCell.getNumericCellValue());


                    // Validate Category ID
                    Cell categoryCell = row.getCell(3);
                    if (categoryCell == null || categoryCell.getCellType() == CellType.BLANK || categoryCell.getCellType() != CellType.NUMERIC) {
                        rowErrors.add("Category ID is Invalid or blank");
                    }
                    else productDTO.setCategoryId((int) categoryCell.getNumericCellValue());

                    // Verify the productDTO
                    Set<ConstraintViolation<ProductDTO>> violations = validator.validate(productDTO);
                    if (!violations.isEmpty()) {
                        String msg = violations.stream()
                                .map(ConstraintViolation::getMessage)
                                .collect(Collectors.joining(", "));
                        rowErrors.add("Validation failed: " + msg);
                    }

                    // Final error handling
                    if (!rowErrors.isEmpty()) {
                        errors.add("Row " + rowNum + ": " + String.join("; ", rowErrors));
                        rowNum++;
                        continue;
                    }

                    // Fetch category
                    Category category = categoryRepo.findById(productDTO.getCategoryId()).orElseThrow(() -> new IllegalArgumentException("Category ID not found: " + productDTO.getCategoryId()));

                    // Map and Save
                    modelMapper.typeMap(ProductDTO.class, Product.class).addMappings(mapper -> mapper.skip(Product::setId));
                    Product product = modelMapper.map(productDTO, Product.class);
                    product.setCategory(category);
                    product.setCreatedDate(new Date());
                    productRepo.save(product);
                    successCount++;

                }catch (Exception e){
                    errors.add("Row " + rowNum + ": " + e.getMessage());
                }
                rowNum++;
            }

        }catch (IOException e){
            throw new RuntimeException("Error reading Excel file.");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("successfullyImported", successCount);
        result.put("skipped", errors.size());
        result.put("errors", errors);

        return result;
    }

}
