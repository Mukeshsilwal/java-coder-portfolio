package com.portfolio.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceRequestDTO {
    private String company;
    private String role;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    
    @com.fasterxml.jackson.annotation.JsonProperty("isCurrent")
    private boolean isCurrent;
    
    private List<String> technologies;
    private String logoUrl;
    private String jobType;
    private String workMode;
    private Integer order;
}
