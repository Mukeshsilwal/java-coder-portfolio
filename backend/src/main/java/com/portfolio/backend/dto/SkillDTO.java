package com.portfolio.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class SkillDTO {
    private UUID id;
    private String skillName;
    private String category;
    private String proficiencyLevel;
    private Integer experienceYears;
    private String iconUrl;
    private Integer displayOrder;
}
