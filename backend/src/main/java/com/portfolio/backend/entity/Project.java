package com.portfolio.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String techStack;

    private String githubRepoUrl;
    private String liveDemoUrl;
    private String projectImage;
    private String projectImageUrl;

    @Enumerated(EnumType.STRING)
    private ProjectType projectType;

    private LocalDate startDate;
    private LocalDate endDate;
    
    @Column(columnDefinition = "boolean default false")
    private Boolean isFeatured;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum ProjectType {
        PERSONAL, CLIENT, OPEN_SOURCE
    }
}
