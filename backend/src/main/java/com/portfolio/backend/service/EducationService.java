package com.portfolio.backend.service;

import com.portfolio.backend.entity.Education;
import com.portfolio.backend.repository.EducationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EducationService {
    private final EducationRepository repository;

    public List<Education> getAllEducation() {
        return repository.findAllByOrderByOrderIndexAsc();
    }

    public List<Education> getPublicEducation() {
        return repository.findByVisibleTrueOrderByOrderIndexAsc();
    }

    public Education createEducation(Education education) {
        if (education.getOrderIndex() == null) {
            // Put it at default 0 or we could fetch max, but Frontend usually handles order or 0 is fine
            education.setOrderIndex(0);
        }
        return repository.save(education);
    }

    public Education updateEducation(UUID id, Education updated) {
        Education existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Education not found"));
        
        if(updated.getInstitution() != null) existing.setInstitution(updated.getInstitution());
        if(updated.getDegree() != null) existing.setDegree(updated.getDegree());
        if(updated.getLocation() != null) existing.setLocation(updated.getLocation());
        if(updated.getStartDate() != null) existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate()); // Can be null if ongoing
        if(updated.getStatus() != null) existing.setStatus(updated.getStatus());
        if(updated.getGrade() != null) existing.setGrade(updated.getGrade());
        if(updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if(updated.getCertificateUrl() != null) existing.setCertificateUrl(updated.getCertificateUrl());
        if(updated.getVisible() != null) existing.setVisible(updated.getVisible());
        if(updated.getOrderIndex() != null) existing.setOrderIndex(updated.getOrderIndex());
        
        return repository.save(existing);
    }

    public void deleteEducation(UUID id) {
        repository.deleteById(id);
    }

    @Transactional
    public void reorderEducation(List<UUID> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            UUID id = orderedIds.get(i);
            Education education = repository.findById(id).orElse(null);
            if (education != null) {
                education.setOrderIndex(i);
                repository.save(education);
            }
        }
    }
}
