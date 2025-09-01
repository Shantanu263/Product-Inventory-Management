package com.shantanu.product_inventory.repositories;

import com.shantanu.product_inventory.models.Admin;
import com.shantanu.product_inventory.models.ForgotPasswordOTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForgotPasswordOTPRepo extends JpaRepository<ForgotPasswordOTP,Integer> {
    Optional<ForgotPasswordOTP> findByOtpAndUser_Email(int otp, String userEmail);
    Optional<ForgotPasswordOTP> findByUser(Admin user);
}
