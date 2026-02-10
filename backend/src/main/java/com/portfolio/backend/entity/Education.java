package com.portfolio.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "education")
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "institution", nullable = false, length = 500)
    private String institution;

    @Column(length = 500)
    private String degree;

    private String location;

    private LocalDate startDate;
    private LocalDate endDate;

    private String status; // e.g. "Completed", "Ongoing"

    private String grade;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "certificate_url", columnDefinition = "TEXT")
    private String certificateUrl;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(columnDefinition = "boolean default true")
    private Boolean visible;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
