package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.entity.Resume;
import com.portfolio.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
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
    public ResponseEntity<Resource> downloadResume() {
        try {
            resumeService.incrementDownloadCount();
            Resume resume = resumeService.getActiveResumeMetadata();
            
            // Log details as requested (like HR/Admin endpoint)
            System.out.println("Public user requesting latest active CV: " + resume.getFileName() +
                    ", Uploaded: " + resume.getUploadedAt() + ", Type: " + resume.getContentType());
            
            String fileName = resume.getFileName() != null ? resume.getFileName() : "resume.pdf";

            // If we have BLOB data, serve it directly
            if (resume.getData() != null && resume.getData().length > 0) {
                Resource resource = new ByteArrayResource(resume.getData());
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                        .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                        .body(resource);
            }

            // Fallback: Cloudinary Proxy (Legacy support)
            String urlString = resume.getUrl();
            if (urlString != null && urlString.startsWith("http")) {
                URL url = new URL(urlString);
                byte[] bytes;
                try (InputStream is = url.openStream()) {
                    bytes = is.readAllBytes();
                }
                Resource resource = new ByteArrayResource(bytes);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                        .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(bytes.length))
                        .body(resource);
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/admin/cv/download/latest")
    public ResponseEntity<Resource> downloadLatestResume() {
        try {
            String username = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication().getName();

            Resume resume = resumeService.getLatestResumeForUser(username);

            // Log details as requested
            System.out.println("User " + username + " requesting latest CV: " + resume.getFileName() +
                    ", Uploaded: " + resume.getUploadedAt() + ", Type: " + resume.getContentType());

            String fileName = resume.getFileName() != null ? resume.getFileName() : "resume.pdf";
            String contentType = resume.getContentType() != null ? resume.getContentType() : "application/pdf";

            byte[] data = null;
            if (resume.getData() != null && resume.getData().length > 0) {
                data = resume.getData();
            } else if (resume.getUrl() != null && resume.getUrl().startsWith("http")) {
                // Fallback to URL fetch if BLOB is missing
                try (InputStream is = new URL(resume.getUrl()).openStream()) {
                    data = is.readAllBytes();
                }
            }

            if (data == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Resource resource = new ByteArrayResource(data);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .body(resource);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}