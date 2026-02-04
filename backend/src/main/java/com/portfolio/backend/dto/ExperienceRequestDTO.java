package com.portfolio.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExperienceRequestDTO {
    @JsonProperty("company")
    private String company;

    @JsonProperty("role")
    private String role;

    @JsonProperty("description")
    private String description;

    @JsonProperty("startDate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonProperty("endDate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    
    @JsonProperty("isCurrent")
    private boolean isCurrent;
    
    @JsonProperty("technologies")
    private List<String> technologies;

    @JsonProperty("logoUrl")
    private String logoUrl;

    @JsonProperty("jobType")
    private String jobType;

    @JsonProperty("workMode")
    private String workMode;

    @JsonProperty("order")
    private Integer order;
}
