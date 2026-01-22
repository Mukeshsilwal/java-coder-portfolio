package com.portfolio.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ProjectDTO {
    private UUID id;
    private String title;
    private String description;
    private String techStack;
    private String githubRepoUrl;
    private String liveDemoUrl;
    private String projectImage;
    private String projectType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isFeatured;
}
