package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.entity.MediaFile;
import com.portfolio.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            MediaFile cv = mediaService.getActiveCv();
            
            Map<String, String> responseData = new HashMap<>();
            responseData.put("url", cv.getUrl());
            responseData.put("publicId", cv.getPublicId());
            
            return ResponseEntity.ok(ApiResponse.success("CV download URL retrieved", responseData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("CV not available"));
        }
    }

    /**
     * Direct redirect to CV (alternative approach)
     */
    @GetMapping("/cv/download")
    public ResponseEntity<?> downloadCV() {
        try {
            MediaFile cv = mediaService.getActiveCv();
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", cv.getUrl())
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("CV not available"));
        }
    }
}
