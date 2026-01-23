package com.portfolio.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "experience")
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "company_name")
    private String company;
    
    @Column(name = "role")
    private String role;
    
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean isCurrent;
    private String logoUrl;
    
    @ElementCollection
    private java.util.List<String> technologies;
    
    @Column(name = "job_type")
    private String jobType;
    
    @Column(name = "display_order")
    private Integer order;
}
