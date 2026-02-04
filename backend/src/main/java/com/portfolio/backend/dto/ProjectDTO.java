package com.portfolio.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ProjectDTO {
    @JsonProperty("id")
    private UUID id;

    @JsonProperty("title")
    private String title;

    @JsonProperty("description")
    private String description;

    @JsonProperty("techStack")
    private String techStack;

    @JsonProperty("githubRepoUrl")
    private String githubRepoUrl;

    @JsonProperty("liveDemoUrl")
    private String liveDemoUrl;

    @JsonProperty("projectImage")
    private String projectImage;

    @JsonProperty("projectType")
    private String projectType;

    @JsonProperty("startDate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonProperty("endDate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @JsonProperty("isFeatured")
    private Boolean isFeatured;
}
