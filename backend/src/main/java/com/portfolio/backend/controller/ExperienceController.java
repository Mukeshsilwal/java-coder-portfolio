package com.portfolio.backend.controller;

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
    public ResponseEntity<List<Experience>> getAllExperience() {
        return ResponseEntity.ok(service.getAllExperience());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Experience> createExperience(@RequestBody Experience experience) {
        return ResponseEntity.ok(service.saveExperience(experience));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Experience> updateExperience(@PathVariable UUID id, @RequestBody Experience experience) {
        experience.setId(id);
        return ResponseEntity.ok(service.saveExperience(experience));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteExperience(@PathVariable UUID id) {
        service.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }
}
