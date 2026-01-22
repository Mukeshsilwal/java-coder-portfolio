package com.portfolio.backend.controller;

import com.portfolio.backend.service.BlogService;
import com.portfolio.backend.service.ImageUploadService;
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

    private final ImageUploadService imageUploadService;
    private final ProfileService profileService;
    private final ProjectService projectService;
    private final BlogService blogService;
    private final SkillService skillService;

    @PostMapping("/profile/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        String url = imageUploadService.uploadImage(file, "portfolio/profile");
        String oldUrl = profileService.updateProfileImage(url);
        deleteOldImage(oldUrl);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/projects/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadProjectImage(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        String url = imageUploadService.uploadImage(file, "portfolio/projects");
        String oldUrl = projectService.updateProjectImage(id, url);
        deleteOldImage(oldUrl);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/blogs/{id}/thumbnail")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadBlogThumbnail(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        String url = imageUploadService.uploadImage(file, "portfolio/blogs");
        String oldUrl = blogService.updateBlogThumbnail(id, url);
        deleteOldImage(oldUrl);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/skills/{id}/icon")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadSkillIcon(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        String url = imageUploadService.uploadImage(file, "portfolio/skills");
        String oldUrl = skillService.updateSkillIcon(id, url);
        deleteOldImage(oldUrl);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @DeleteMapping("/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteImage(@RequestParam String publicId) {
        imageUploadService.deleteImage(publicId);
        return ResponseEntity.ok("Image deleted successfully");
    }

    private void deleteOldImage(String oldUrl) {
        if (oldUrl != null && !oldUrl.isEmpty()) {
            String publicId = imageUploadService.extractPublicIdFromUrl(oldUrl);
            if (publicId != null) {
                imageUploadService.deleteImage(publicId);
            }
        }
    }
}
