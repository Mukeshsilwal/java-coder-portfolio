package com.portfolio.backend.repository;

import com.portfolio.backend.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, UUID> {
    Optional<Resume> findByIsActiveTrue();

    @Modifying
    @Query("UPDATE Resume r SET r.isActive = false WHERE r.isActive = true")
    void deactivateAll();

    Optional<Resume> findTopByUploadedByOrderByUploadedAtDesc(String uploadedBy);

    Optional<Resume> findTopByIsActiveTrueOrderByUploadedAtDesc();
}
