package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.entity.MediaFile;
import com.portfolio.backend.entity.MediaType;
import com.portfolio.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/media")
@RequiredArgsConstructor
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
            // Validate image file
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Only image files are allowed"));
            }

            MediaFile media = mediaService.uploadMedia(file, MediaType.IMAGE);

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("url", media.getUrl());
            responseData.put("publicId", media.getPublicId());
            responseData.put("id", media.getId());
            responseData.put("uploadedAt", media.getUploadedAt());

            return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", responseData));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        }
    }

    /**
     * Upload CV/Resume (PDF only)
     * Automatically deactivates previous CV and sets new one as active
     */
    @PostMapping("/upload/cv")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadCV(@RequestParam("file") MultipartFile file) {
        try {
            // Validate PDF file
            if (!file.getContentType().equals("application/pdf")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Only PDF files are allowed for CV"));
            }

            MediaFile media = mediaService.uploadMedia(file, MediaType.CV);

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("url", media.getUrl());
            responseData.put("publicId", media.getPublicId());
            responseData.put("id", media.getId());
            responseData.put("fileName", file.getOriginalFilename());
            responseData.put("fileSize", file.getSize());
            responseData.put("uploadedAt", media.getUploadedAt());
            responseData.put("active", media.isActive());

            return ResponseEntity.ok(ApiResponse.success("CV uploaded successfully", responseData));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload CV: " + e.getMessage()));
        }
    }

    /**
     * Get active CV metadata
     */
    @GetMapping("/cv/active")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getActiveCV() {
        try {
            MediaFile cv = mediaService.getActiveMediaByType(MediaType.CV);

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("url", cv.getUrl());
            responseData.put("publicId", cv.getPublicId());
            responseData.put("id", cv.getId());
            responseData.put("uploadedAt", cv.getUploadedAt());
            responseData.put("active", cv.isActive());

            return ResponseEntity.ok(ApiResponse.success("Active CV retrieved", responseData));
        } catch (RuntimeException e) {
            // Return 200 with null data to signify "no CV" without causing a 404 error on frontend
            return ResponseEntity.ok(ApiResponse.success("No active CV found", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error retrieving CV: " + e.getMessage()));
        }
    }

    /**
     * Delete media by ID
     * Deletes from both Cloudinary and database
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMedia(@PathVariable Long id) {
        try {
            MediaFile media = mediaService.getMediaById(id);
            mediaService.deleteMedia(media.getPublicId());
            return ResponseEntity.ok(ApiResponse.success("Media deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Media not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete media: " + e.getMessage()));
        }
    }

    /**
     * Delete media by publicId
     * Deletes from both Cloudinary and database
     */
    @DeleteMapping("/by-public-id")
    public ResponseEntity<ApiResponse<Void>> deleteMediaByPublicId(@RequestParam String publicId) {
        try {
            mediaService.deleteMedia(publicId);
            return ResponseEntity.ok(ApiResponse.success("Media deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Media not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete media: " + e.getMessage()));
        }
    }

    /**
     * Deactivate media (soft delete) - keeps file in Cloudinary but marks as inactive
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateMedia(@PathVariable Long id) {
        try {
            MediaFile media = mediaService.getMediaById(id);
            mediaService.deactivateMedia(media.getPublicId());
            return ResponseEntity.ok(ApiResponse.success("Media deactivated successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Media not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to deactivate media: " + e.getMessage()));
        }
    }

    /**
     * Get all media files by type
     * If type is null, returns all media files
     */
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<MediaFile>>> listMedia(
            @RequestParam(required = false) MediaType type) {
        try {
            List<MediaFile> mediaFiles = type != null
                    ? mediaService.getAllMediaByType(type)
                    : mediaService.getAllActiveMedia();

            return ResponseEntity.ok(ApiResponse.success("Media list retrieved", mediaFiles));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve media list: " + e.getMessage()));
        }
    }

    /**
     * Get all active media files
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<MediaFile>>> listActiveMedia() {
        try {
            List<MediaFile> mediaFiles = mediaService.getAllActiveMedia();
            return ResponseEntity.ok(ApiResponse.success("Active media retrieved", mediaFiles));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve active media: " + e.getMessage()));
        }
    }

    /**
     * Get media file by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MediaFile>> getMediaById(@PathVariable Long id) {
        try {
            MediaFile media = mediaService.getMediaById(id);
            return ResponseEntity.ok(ApiResponse.success("Media retrieved", media));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Media not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve media: " + e.getMessage()));
        }
    }

    /**
     * Get statistics about media files
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMediaStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalImages", mediaService.countActiveByType(MediaType.IMAGE));
            stats.put("totalCVs", mediaService.countActiveByType(MediaType.CV));
            stats.put("totalActive", mediaService.getAllActiveMedia().size());

            return ResponseEntity.ok(ApiResponse.success("Media statistics retrieved", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve statistics: " + e.getMessage()));
        }
    }
}