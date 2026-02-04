package com.portfolio.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationRequestDTO {
    @JsonProperty("institution")
    private String institution;

    @JsonProperty("degree")
    private String degree;

    @JsonProperty("location")
    private String location;

    @JsonProperty("startDate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonProperty("endDate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @JsonProperty("status")
    private String status;

    @JsonProperty("grade")
    private String grade;

    @JsonProperty("description")
    private String description;

    @JsonProperty("certificateUrl")
    private String certificateUrl;

    @JsonProperty("orderIndex")
    private Integer orderIndex;

    @JsonProperty("visible")
    private Boolean visible;
}
