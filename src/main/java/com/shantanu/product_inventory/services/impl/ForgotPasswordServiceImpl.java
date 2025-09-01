package com.shantanu.product_inventory.services.impl;

import com.shantanu.product_inventory.dtos.MailBody;
import com.shantanu.product_inventory.globalExceptionHandlers.ResourceNotFoundException;
import com.shantanu.product_inventory.models.Admin;
import com.shantanu.product_inventory.models.ForgotPasswordOTP;
import com.shantanu.product_inventory.repositories.AdminRepo;
import com.shantanu.product_inventory.repositories.ForgotPasswordOTPRepo;
import com.shantanu.product_inventory.services.EmailService;
import com.shantanu.product_inventory.services.ForgotPasswordService;
import com.shantanu.product_inventory.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.Random;

@RequiredArgsConstructor
@Service
public class ForgotPasswordServiceImpl implements ForgotPasswordService {
    private final AdminRepo userRepo;
    private final ForgotPasswordOTPRepo forgotPasswordOTPRepo;
    private final EmailService emailService;
    private final JWTService jWTService;
    private final PasswordEncoder encoder;

    @Override
    @Transactional
    public void verifyEmail(String email) {
        Admin user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User","Email Id",email));

        int otp = new Random().nextInt(100_000, 999_999);

        MailBody mailBody = MailBody.builder()
                .to(email)
                .text("Hello, " + user.getUsername() + " this is the OTP for Password Reset: " + otp)
                .subject("OTP for Password Reset")
                .build();

        ForgotPasswordOTP forgotPasswordOTP = forgotPasswordOTPRepo.findByUser(user)
                .orElse(ForgotPasswordOTP.builder().user(user).build());

        forgotPasswordOTP.setOtp(otp);
        forgotPasswordOTP.setExpirationTime(new Date(System.currentTimeMillis() + 90 * 1000));

        emailService.sendSimpleMessage(mailBody);                               // Send mail to user
        forgotPasswordOTPRepo.save(forgotPasswordOTP);                          //save new OTP
    }

    @Override
    public ResponseEntity<?> verifyOtp(int otp, String email){
        ForgotPasswordOTP savedOtp = forgotPasswordOTPRepo.findByOtpAndUser_Email(otp,email)
                .orElseThrow(()-> new ResourceNotFoundException("Otp not present or mismatching","User Email",email));

        if (savedOtp.getExpirationTime().before(Date.from(Instant.now()))){
            forgotPasswordOTPRepo.delete(savedOtp);
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("OTP expired");
        }
        forgotPasswordOTPRepo.delete(savedOtp);

        Admin user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User","Email Id",email));

        String resetToken = jWTService.generateToken(user.getUsername(), user.getRole(), 1000 * 180);  //3 mins
        return ResponseEntity.ok(Map.of("resetToken", resetToken));
    }

    @Override
    public ResponseEntity<?> changePassword(String newPassword, Long userId) {
        Admin user = userRepo.findById(userId)
                .orElseThrow(()-> new ResourceNotFoundException("user","user id",userId));

        if (encoder.matches(newPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "New password must be different from old password"));
        }

        user.setPassword(encoder.encode(newPassword));
        userRepo.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
