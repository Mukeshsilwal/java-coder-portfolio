package com.portfolio.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationRequestDTO {
    private String institution;
    private String degree;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String grade;
    private String description;
    private String certificateUrl;
    private Integer orderIndex;
    private Boolean visible;
}
