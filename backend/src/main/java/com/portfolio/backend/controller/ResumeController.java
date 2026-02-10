package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.entity.Resume;
import com.portfolio.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping(value = "/admin/cv/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            // Validate PDF
            if (!file.getContentType().equals("application/pdf")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Only PDF files are allowed"));
            }

            String username = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication().getName();
            Resume resume = resumeService.uploadResume(file, username);

            Map<String, Object> data = new HashMap<>();
            data.put("fileName", resume.getFileName());
            data.put("url", resume.getUrl());
            data.put("downloadUrl", "/api/public/cv/download");

            return ResponseEntity.ok(ApiResponse.success("CV uploaded successfully", data));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to upload CV: " + e.getMessage()));
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
            return ResponseEntity.ok(ApiResponse.success("CV metadata retrieved successfully",
                    resumeService.getActiveResumeMetadata()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.success("No active CV found", null));
        }
    }

    @GetMapping("/public/cv/download")
    public ResponseEntity<Void> downloadResume() {
        try {
            resumeService.incrementDownloadCount();
            Resume resume = resumeService.getActiveResumeMetadata();
            String url = resume.getUrl();

            // Prepare a safe filename for Cloudinary attachment flag
            String fileName = resume.getFileName() != null ? resume.getFileName() : "resume.pdf";
            String safeFileName = fileName.replaceAll("[^a-zA-Z0-9.-]", "_");
            
            String downloadUrl = url;
            // Cloudinary "fl_attachment" flag ensures browser triggers download
            if (url.contains("/upload/")) {
                downloadUrl = url.replace("/upload/", "/upload/fl_attachment:" + safeFileName + "/");
            }

            return ResponseEntity.status(HttpStatus.FOUND)
                    .header(HttpHeaders.LOCATION, downloadUrl)
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}