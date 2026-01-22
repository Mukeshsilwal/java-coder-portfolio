package com.portfolio.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ProfileDTO {
    private UUID id;
    private String headline;
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
    private String availabilityStatus;
}
