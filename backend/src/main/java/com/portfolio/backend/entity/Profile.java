package com.portfolio.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "profile")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String headline;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    private Integer yearsOfExperience;
    private String resumeUrl;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioWebsite;
    private String location;
    private String phone;
    private String email;
    private String profileImage;
    private String profileImageUrl;
    private String availabilityStatus;
}
