package com.portfolio.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploadService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folderName) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Empty file");
            }

            // Upload options: folder, auto format, auto quality handling is done via URL mostly, 
            // but we can set some upload presets here if needed.
            // For now, just folder.
            Map params = ObjectUtils.asMap(
                    "folder", folderName,
                    "resource_type", "image"
            );

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            return (String) uploadResult.get("secure_url");

        } catch (IOException e) {
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            // Log error but might not want to block flow
            System.err.println("Failed to delete image: " + publicId);
        }
    }
    
    // Helper to extract publicId from URL if needed contextually, 
    // but usually we store publicId separately. 
    // For this requirement, we are only storing URL, so deletion might require parsing or just not deleting for now unless metadata is stored.
    // The requirement 'Optional: image_metadata table' suggests we might not have it yet.
    // However, 'delete old image (if replacing)' is a requirement. 
    // We can extract public_id from secure_url with regex if standard cloudinary URL.
    public String extractPublicIdFromUrl(String url) {
        // Example: https://res.cloudinary.com/demo/image/upload/v12345678/folder/sample.jpg
        // Public ID: folder/sample
        try {
             if (url == null || !url.contains("/upload/")) return null;
             
             String[] parts = url.split("/upload/");
             if (parts.length < 2) return null;
             
             String path = parts[1];
             // Remove version if present (v12345...)
             if (path.matches("^v\\d+/.*")) {
                 path = path.replaceFirst("^v\\d+/", "");
             }
             
             // Remove extension
             int lastDotIndex = path.lastIndexOf(".");
             if (lastDotIndex != -1) {
                 path = path.substring(0, lastDotIndex);
             }
             
             return path;
        } catch (Exception e) {
            return null;
        }
    }
}
