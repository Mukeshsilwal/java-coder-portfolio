package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.dto.ContactRequestDTO;
import com.portfolio.backend.entity.ContactMessage;
import com.portfolio.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService service;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessage>> sendMessage(@jakarta.validation.Valid @RequestBody ContactRequestDTO dto, HttpServletRequest request) {
        ContactMessage message = ContactMessage.builder()
                .senderName(dto.getSenderName())
                .senderEmail(dto.getSenderEmail())
                .subject(dto.getSubject())
                .message(dto.getMessage())
                .ipAddress(request.getRemoteAddr())
                .build();
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", service.saveMessage(message)));
    }
    
    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ContactMessage>>> getAllMessages() {
        return ResponseEntity.ok(ApiResponse.success("Messages retrieved successfully", service.getAllMessages()));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable java.util.UUID id) {
        service.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.success("Message deleted successfully", null));
    }

    @PutMapping("/{id}/read")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ContactMessage>> markAsRead(@PathVariable java.util.UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Message marked as read", service.markMessageAsRead(id)));
    }
}
