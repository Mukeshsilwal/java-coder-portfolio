package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.dto.SkillDTO;
import com.portfolio.backend.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillDTO>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.success("Skills retrieved successfully", service.getAllSkills()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SkillDTO>> createSkill(@RequestBody @jakarta.validation.Valid SkillDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Skill created successfully", service.createSkill(dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable UUID id) {
        service.deleteSkill(id);
        return ResponseEntity.ok(ApiResponse.success("Skill deleted successfully", null));
    }
}
