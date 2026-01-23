package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.entity.Resume;
import com.portfolio.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.URI;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping(value = "/admin/cv/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // Security handled by SecurityConfig for /api/admin/**
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            Resume resume = resumeService.uploadResume(file, username);
            
            Map<String, Object> data = new HashMap<>();
            data.put("fileName", resume.getFileName());
            data.put("url", resume.getUrl());
            data.put("downloadUrl", "/api/public/cv/download");
            
            return ResponseEntity.ok(ApiResponse.success("CV uploaded successfully", data));
        } catch (IllegalArgumentException e) {
             return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/admin/cv")
    public ResponseEntity<ApiResponse<Void>> deleteResume() {
        try {
            resumeService.deleteActiveResume();
            return ResponseEntity.ok(ApiResponse.success("CV deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("CV not found"));
        }
    }

    @GetMapping("/admin/cv")
    public ResponseEntity<ApiResponse<Resume>> getResumeMetadata() {
        try {
            return ResponseEntity.ok(ApiResponse.success("CV metadata retrieved successfully", resumeService.getActiveResumeMetadata()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("CV not found"));
        }
    }

    @GetMapping("/public/cv/download")
    public ResponseEntity<?> downloadResume() {
        try {
            resumeService.incrementDownloadCount();
            String url = resumeService.getActiveResumeUrl();
            
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(url))
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("CV not found"));
        }
    }
}
