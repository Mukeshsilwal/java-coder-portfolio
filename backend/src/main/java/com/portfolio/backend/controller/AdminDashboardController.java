package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final ProjectRepository projectRepository;
    private final BlogPostRepository blogRepository;
    private final ProfileRepository profileRepository;
    private final ResumeRepository resumeRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final EducationRepository educationRepository;
    
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("projects", projectRepository.count());
        stats.put("blogs", blogRepository.count());
        stats.put("education", educationRepository.count());
        
        // Sum visits from all profiles (usually just 1)
        Long totalViews = profileRepository.findAll().stream()
                .mapToLong(p -> p.getVisitCount() != null ? p.getVisitCount() : 0)
                .sum();
        stats.put("views", totalViews);
        
        Long totalDownloads = resumeRepository.findAll().stream()
                .mapToLong(r -> r.getDownloadCount() != null ? r.getDownloadCount() : 0)
                .sum();
        stats.put("downloads", totalDownloads);
        
        stats.put("unreadMessages", contactMessageRepository.countByIsReadFalse());
        
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully", stats));
    }
}
