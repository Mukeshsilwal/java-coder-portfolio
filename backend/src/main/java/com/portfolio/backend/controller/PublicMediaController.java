package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.entity.MediaFile;
import com.portfolio.backend.entity.MediaType;
import com.portfolio.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public/media")
@RequiredArgsConstructor
public class PublicMediaController {

    private final MediaService mediaService;

    /**
     * Get active CV URL for public download
     * This endpoint is used by the "Download CV" button on the portfolio
     */
    @GetMapping("/cv/download-url")
    public ResponseEntity<ApiResponse<Map<String, String>>> getCVDownloadUrl() {
        try {
            MediaFile cv = mediaService.getActiveMediaByType(MediaType.CV);

            Map<String, String> responseData = new HashMap<>();
            responseData.put("url", cv.getUrl());
            responseData.put("publicId", cv.getPublicId());

            return ResponseEntity.ok(ApiResponse.success("CV download URL retrieved", responseData));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("CV not available"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error retrieving CV: " + e.getMessage()));
        }
    }

    /**
     * Download CV by redirecting to Cloudinary with attachment flag
     * This avoids proxying large files through the backend and prevents potential timeouts or memory issues
     */
    @GetMapping("/cv/download")
    public ResponseEntity<Void> downloadCV() {
        try {
            MediaFile cv = mediaService.getActiveMediaByType(MediaType.CV);
            String url = cv.getUrl();
            
            // Prepare a safe filename for Cloudinary attachment flag
            String fileName = cv.getFileName() != null ? cv.getFileName() : "resume.pdf";
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

    @GetMapping("/cv/redirect")
    public ResponseEntity<Void> redirectToCV() {
        try {
            MediaFile cv = mediaService.getActiveMediaByType(MediaType.CV);
            String url = cv.getUrl();

            // Cloudinary "attachment" flag ensures browser triggers download
            String fileName = cv.getFileName() != null ? cv.getFileName() : "resume.pdf";
            String downloadUrl = url;
            
            if (url.contains("/upload/")) {
                downloadUrl = url.replace("/upload/", "/upload/fl_attachment:" + fileName.replace(" ", "_") + "/");
            }

            return ResponseEntity.status(HttpStatus.FOUND)
                    .header(HttpHeaders.LOCATION, downloadUrl)
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Get CV metadata (without downloading)
     */
    @GetMapping("/cv/info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCVInfo() {
        try {
            MediaFile cv = mediaService.getActiveMediaByType(MediaType.CV);

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("fileName", extractFileNameFromPublicId(cv.getPublicId(), "resume.pdf"));
            responseData.put("uploadedAt", cv.getUploadedAt());
            responseData.put("available", true);

            return ResponseEntity.ok(ApiResponse.success("CV information retrieved", responseData));
        } catch (RuntimeException e) {
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("available", false);
            return ResponseEntity.ok(ApiResponse.success("No CV available", responseData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error retrieving CV info: " + e.getMessage()));
        }
    }

    /**
     * Helper method to extract filename from publicId
     * publicId format: portfolio/resumes/filename
     */
    private String extractFileNameFromPublicId(String publicId, String defaultName) {
        if (publicId == null || publicId.isEmpty()) {
            return defaultName;
        }

        try {
            // Get the last part after the last slash
            String[] parts = publicId.split("/");
            String lastPart = parts[parts.length - 1];

            // Add .pdf extension if not present
            if (!lastPart.toLowerCase().endsWith(".pdf")) {
                lastPart += ".pdf";
            }

            return lastPart;
        } catch (Exception e) {
            return defaultName;
        }
    }
}