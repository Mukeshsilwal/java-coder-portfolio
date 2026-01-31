package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.dto.ProfileDTO;
import com.portfolio.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService service;

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileDTO>> getProfile() {
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", service.getProfile()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProfileDTO>> updateProfile(@RequestBody ProfileDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", service.updateProfile(dto)));
    }
}
