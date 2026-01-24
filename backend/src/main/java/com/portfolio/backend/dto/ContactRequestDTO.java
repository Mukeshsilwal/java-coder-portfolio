package com.portfolio.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequestDTO {
    @NotBlank(message = "Name is required")
    private String senderName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String senderEmail;
    
    private String subject;
    
    @NotBlank(message = "Message is required")
    private String message;
}
