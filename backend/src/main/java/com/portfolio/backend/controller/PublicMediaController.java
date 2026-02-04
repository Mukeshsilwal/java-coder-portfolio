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
     * Stream CV as download (recommended approach)
     * This provides proper download headers and filename
     */
    @GetMapping("/cv/download")
    public ResponseEntity<Resource> downloadCV() {
        try {
            MediaFile cv = mediaService.getActiveMediaByType(MediaType.CV);
            String cloudinaryUrl = cv.getUrl();

            // Open connection to Cloudinary URL
            URL url = new URL(cloudinaryUrl);
            InputStream inputStream = url.openStream();

            InputStreamResource resource = new InputStreamResource(inputStream);

            // Extract filename from publicId or use default
            String fileName = extractFileNameFromPublicId(cv.getPublicId(), "resume.pdf");

            // Set proper headers for PDF download
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    org.springframework.http.ContentDisposition.attachment()
                            .filename(fileName)
                            .build()
            );

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Alternative: Direct redirect to Cloudinary (simpler but less control)
     * Use this if you want Cloudinary to handle the download directly
     */
    @GetMapping("/cv/redirect")
    public ResponseEntity<?> redirectToCV() {
        try {
            MediaFile cv = mediaService.getActiveMediaByType(MediaType.CV);

            // Add download transformation to Cloudinary URL
            String fileName = extractFileNameFromPublicId(cv.getPublicId(), "resume.pdf");
            String downloadUrl = cv.getUrl().replace("/upload/", "/upload/fl_attachment:" + fileName + "/");

            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", downloadUrl)
                    .build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("CV not available"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error accessing CV: " + e.getMessage()));
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