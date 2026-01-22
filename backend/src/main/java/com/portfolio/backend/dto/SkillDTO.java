package com.portfolio.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class SkillDTO {
    private UUID id;
    
    @jakarta.validation.constraints.NotNull(message = "Skill name is required")
    @jakarta.validation.constraints.NotEmpty(message = "Skill name cannot be empty")
    private String skillName;
    
    @jakarta.validation.constraints.NotNull
    private String category;
    
    private String proficiencyLevel;
    private Integer experienceYears;
    private String iconUrl;
    private Integer displayOrder;
}
