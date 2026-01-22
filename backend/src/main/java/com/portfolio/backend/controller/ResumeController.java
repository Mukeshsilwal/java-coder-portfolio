package com.portfolio.backend.controller;

import com.portfolio.backend.entity.Resume;
import com.portfolio.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping(value = "/admin/cv/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // Security handled by SecurityConfig for /api/admin/**
    public ResponseEntity<Map<String, Object>> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            Resume resume = resumeService.uploadResume(file, username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("fileName", resume.getFileName());
            response.put("downloadUrl", "/api/public/cv/download");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
             return ResponseEntity.badRequest().body(Map.of("status", "ERROR", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("status", "ERROR", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/admin/cv")
    public ResponseEntity<Void> deleteResume() {
        try {
            resumeService.deleteActiveResume();
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/admin/cv")
    public ResponseEntity<Resume> getResumeMetadata() {
        try {
            return ResponseEntity.ok(resumeService.getActiveResumeMetadata());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/public/cv/download")
    public ResponseEntity<Resource> downloadResume() {
        try {
            Resume resume = resumeService.getActiveResumeMetadata();
            Resource resource = resumeService.getActiveResumeResource();
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resume.getFileName() + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600") // Cache for 1 hour
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
