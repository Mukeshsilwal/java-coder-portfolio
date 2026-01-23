package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.entity.MediaFile;
import com.portfolio.backend.entity.MediaType;
import com.portfolio.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/media")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminMediaController {

    private final MediaService mediaService;

    /**
     * Upload image (profile, project, blog, skill)
     * Supports: jpg, png, webp, svg
     */
    @PostMapping("/upload/image")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {
        try {
            MediaFile media = mediaService.uploadImage(file, folder);
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("url", media.getUrl());
            responseData.put("publicId", media.getPublicId());
            responseData.put("id", media.getId());
            
            return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", responseData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Upload CV/Resume (PDF or DOCX)
     * Automatically deactivates previous CV and sets new one as active
     */
    @PostMapping("/upload/cv")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadCV(@RequestParam("file") MultipartFile file) {
        try {
            MediaFile media = mediaService.uploadMedia(file, MediaType.CV);
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("url", media.getUrl());
            responseData.put("publicId", media.getPublicId());
            responseData.put("id", media.getId());
            responseData.put("fileName", file.getOriginalFilename());
            responseData.put("uploadedAt", media.getUploadedAt());
            
            return ResponseEntity.ok(ApiResponse.success("CV uploaded successfully", responseData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get active CV metadata
     */
    @GetMapping("/cv/active")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getActiveCV() {
        try {
            MediaFile cv = mediaService.getActiveCv();
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("url", cv.getUrl());
            responseData.put("publicId", cv.getPublicId());
            responseData.put("uploadedAt", cv.getUploadedAt());
            
            return ResponseEntity.ok(ApiResponse.success("Active CV retrieved", responseData));
        } catch (Exception e) {
            // Return 200 with null data to signify "no CV" without causing a 404 error on frontend
            return ResponseEntity.ok(ApiResponse.success("No active CV found", null));
        }
    }

    /**
     * Delete media by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMedia(@PathVariable Long id) {
        try {
            mediaService.deleteMedia(id);
            return ResponseEntity.ok(ApiResponse.success("Media deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Delete media by publicId (for legacy support)
     */
    @DeleteMapping("/by-public-id")
    public ResponseEntity<ApiResponse<Void>> deleteMediaByPublicId(@RequestParam String publicId) {
        try {
            mediaService.deleteMediaByPublicId(publicId);
            return ResponseEntity.ok(ApiResponse.success("Media deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get all media files by type
     */
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<MediaFile>>> listMedia(@RequestParam(required = false) MediaType type) {
        try {
            List<MediaFile> mediaFiles = type != null 
                    ? mediaService.getAllMedia(type)
                    : mediaService.getAllMedia(null);
            return ResponseEntity.ok(ApiResponse.success("Media list retrieved", mediaFiles));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
