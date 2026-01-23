package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.dto.ProjectDTO;
import com.portfolio.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getAllProjects() {
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved successfully", service.getAllProjects()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDTO>> getProjectById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Project retrieved successfully", service.getProjectById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProjectDTO>> createProject(@RequestBody ProjectDTO projectDTO) {
        return ResponseEntity.ok(ApiResponse.success("Project created successfully", service.createProject(projectDTO)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProjectDTO>> updateProject(@PathVariable UUID id, @RequestBody ProjectDTO projectDTO) {
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", service.updateProject(id, projectDTO)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable UUID id) {
        service.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
}
