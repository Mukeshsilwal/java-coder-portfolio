package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
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
    public ResponseEntity<ApiResponse<ContactMessage>> sendMessage(@RequestBody ContactMessage message, HttpServletRequest request) {
        message.setIpAddress(request.getRemoteAddr());
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
}
