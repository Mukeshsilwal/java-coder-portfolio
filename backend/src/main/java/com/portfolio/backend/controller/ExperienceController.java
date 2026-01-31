package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.entity.Experience;
import com.portfolio.backend.service.ExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/experience")
@RequiredArgsConstructor
public class ExperienceController {

    private final ExperienceService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Experience>>> getAllExperience() {
        return ResponseEntity.ok(ApiResponse.success("Experience retrieved successfully", service.getAllExperience()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Experience>> createExperience(@RequestBody com.portfolio.backend.dto.ExperienceRequestDTO dto) {
        Experience experience = Experience.builder()
                .company(dto.getCompany())
                .role(dto.getRole())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.isCurrent() ? null : dto.getEndDate())
                .isCurrent(dto.isCurrent())
                .technologies(dto.getTechnologies())
                .logoUrl(dto.getLogoUrl())
                .jobType(dto.getJobType())
                .workMode(dto.getWorkMode())
                .order(dto.getOrder())
                .build();
        return ResponseEntity.ok(ApiResponse.success("Experience created successfully", service.saveExperience(experience)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Experience>> updateExperience(@PathVariable UUID id, @RequestBody com.portfolio.backend.dto.ExperienceRequestDTO dto) {
        Experience experience = Experience.builder()
                .id(id)
                .company(dto.getCompany())
                .role(dto.getRole())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.isCurrent() ? null : dto.getEndDate())
                .isCurrent(dto.isCurrent())
                .technologies(dto.getTechnologies())
                .logoUrl(dto.getLogoUrl())
                .jobType(dto.getJobType())
                .workMode(dto.getWorkMode())
                .order(dto.getOrder())
                .build();
        return ResponseEntity.ok(ApiResponse.success("Experience updated successfully", service.saveExperience(experience)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable UUID id) {
        service.deleteExperience(id);
        return ResponseEntity.ok(ApiResponse.success("Experience deleted successfully", null));
    }
}
