package com.portfolio.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public Map uploadFile(MultipartFile file, String folderName, String resourceType) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Empty file");
            }

            Map params = ObjectUtils.asMap(
                    "folder", folderName,
                    "resource_type", resourceType,
                    "use_filename", true,
                    "unique_filename", true
            );

            return cloudinary.uploader().upload(file.getBytes(), params);

        } catch (IOException e) {
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }

    public void deleteFile(String publicId, String resourceType) {
        try {
            Map params = ObjectUtils.asMap("resource_type", resourceType);
            cloudinary.uploader().destroy(publicId, params);
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + publicId);
            throw new RuntimeException("Delete failed: " + e.getMessage());
        }
    }
    
    // Helper to extract publicId from URL
    public String extractPublicIdFromUrl(String url) {
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
