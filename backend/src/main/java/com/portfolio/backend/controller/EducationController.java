package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.dto.EducationRequestDTO;
import com.portfolio.backend.entity.Education;
import com.portfolio.backend.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EducationController {

    private final EducationService service;

    // Public Endpoints
    @GetMapping("/public/education")
    public ResponseEntity<ApiResponse<List<Education>>> getPublicEducation() {
        return ResponseEntity.ok(ApiResponse.success("Public education retrieved successfully", service.getPublicEducation()));
    }

    // Admin Endpoints
    @GetMapping("/admin/education")
    public ResponseEntity<ApiResponse<List<Education>>> getAllEducation() {
        return ResponseEntity.ok(ApiResponse.success("All education records retrieved successfully", service.getAllEducation()));
    }

    @PostMapping("/admin/education")
    public ResponseEntity<ApiResponse<Education>> createEducation(@RequestBody EducationRequestDTO dto) {
        Education education = Education.builder()
                .institution(dto.getInstitution())
                .degree(dto.getDegree())
                .location(dto.getLocation())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus())
                .grade(dto.getGrade())
                .description(dto.getDescription())
                .certificateUrl(dto.getCertificateUrl())
                .orderIndex(dto.getOrderIndex())
                .visible(dto.getVisible() != null ? dto.getVisible() : true)
                .build();
        return ResponseEntity.ok(ApiResponse.success("Education record created successfully", service.createEducation(education)));
    }

    @PutMapping("/admin/education/{id}")
    public ResponseEntity<ApiResponse<Education>> updateEducation(@PathVariable UUID id, @RequestBody EducationRequestDTO dto) {
        Education education = Education.builder()
                .institution(dto.getInstitution())
                .degree(dto.getDegree())
                .location(dto.getLocation())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus())
                .grade(dto.getGrade())
                .description(dto.getDescription())
                .certificateUrl(dto.getCertificateUrl())
                .orderIndex(dto.getOrderIndex())
                .visible(dto.getVisible())
                .build();
        return ResponseEntity.ok(ApiResponse.success("Education record updated successfully", service.updateEducation(id, education)));
    }

    @DeleteMapping("/admin/education/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(@PathVariable UUID id) {
        service.deleteEducation(id);
        return ResponseEntity.ok(ApiResponse.success("Education record deleted successfully", null));
    }

    @PatchMapping("/admin/education/reorder")
    public ResponseEntity<ApiResponse<Void>> reorderEducation(@RequestBody List<UUID> orderedIds) {
        service.reorderEducation(orderedIds);
        return ResponseEntity.ok(ApiResponse.success("Education sequence updated successfully", null));
    }
}
