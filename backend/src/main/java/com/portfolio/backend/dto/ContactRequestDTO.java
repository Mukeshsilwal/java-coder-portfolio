package com.portfolio.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequestDTO {
    @jakarta.validation.constraints.NotBlank(message = "Name is required")
    private String senderName;
    
    @jakarta.validation.constraints.NotBlank(message = "Email is required")
    @jakarta.validation.constraints.Email(message = "Invalid email format")
    private String senderEmail;
    
    private String subject; // Optional
    
    @jakarta.validation.constraints.NotBlank(message = "Message is required")
    private String message;
}
