package com.portfolio.backend.controller;

import com.portfolio.backend.entity.MediaFile;
import com.portfolio.backend.service.BlogService;
import com.portfolio.backend.service.MediaService;
import com.portfolio.backend.service.ProfileService;
import com.portfolio.backend.service.ProjectService;
import com.portfolio.backend.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminImageController {

    private final MediaService mediaService;
    private final ProfileService profileService;
    private final ProjectService projectService;
    private final BlogService blogService;
    private final SkillService skillService;

    @PostMapping("/profile/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        MediaFile media = mediaService.uploadImage(file, "profile");
        String url = media.getUrl();
        String oldUrl = profileService.updateProfileImage(url);
        deleteOldImage(oldUrl);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/projects/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadProjectImage(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        MediaFile media = mediaService.uploadImage(file, "projects");
        String url = media.getUrl();
        String oldUrl = projectService.updateProjectImage(id, url);
        deleteOldImage(oldUrl);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/blogs/{id}/thumbnail")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadBlogThumbnail(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        MediaFile media = mediaService.uploadImage(file, "blogs");
        String url = media.getUrl();
        String oldUrl = blogService.updateBlogThumbnail(id, url);
        deleteOldImage(oldUrl);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/skills/{id}/icon")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadSkillIcon(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        MediaFile media = mediaService.uploadImage(file, "skills");
        String url = media.getUrl();
        String oldUrl = skillService.updateSkillIcon(id, url);
        deleteOldImage(oldUrl);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @DeleteMapping("/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteImage(@RequestParam String publicId) {
        // This relies on finding the media by publicId or ID. 
        // MediaService has deleteMedia(Long id).
        // But here we have publicId.
        // We'll need a method in MediaService to delete by publicId or just delegate to Cloudinary service if MediaFile record doesn't exist?
        // But we want to keep consistency.
        // I'll assume we just want to delete from Cloudinary for now if passed purely publicId (legacy support).
        // Or better: Find MediaFile by publicId and delete.
        // I'll use mediaService which I'll update to handle this if needed, or just access cloudinary directly via mediaService (I didn't expose it).
        // Let's stick to using mediaService deleteMedia(Long id) if possible?
        // But the frontend passes publicId.
        // I'll update MediaService to have deleteMediaByPublicId(String publicId);
        
        // For this step I will comment it out or use a quick fix, then update MediaService.
        // Actually, let's update MediaService first or inline the logic?
        // No, I'll assume I update MediaService.
        mediaService.deleteMediaByPublicId(publicId);
        return ResponseEntity.ok("Image deleted successfully");
    }

    private void deleteOldImage(String oldUrl) {
        if (oldUrl != null && !oldUrl.isEmpty()) {
            mediaService.deleteMediaByUrl(oldUrl);
        }
    }
}
