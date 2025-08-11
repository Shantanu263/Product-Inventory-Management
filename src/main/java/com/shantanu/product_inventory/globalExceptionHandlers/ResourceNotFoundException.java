package com.shantanu.product_inventory.globalExceptionHandlers;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String entity, String fieldName, Object fieldValue){
        super(String.format("The %s with %s : '%s' does not exist !",entity,fieldName,fieldValue));
    }
}
