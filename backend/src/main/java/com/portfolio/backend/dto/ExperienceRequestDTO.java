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
    private boolean current;
    private List<String> technologies;
    private String logoUrl;
    private String jobType;
    private Integer order;
}
