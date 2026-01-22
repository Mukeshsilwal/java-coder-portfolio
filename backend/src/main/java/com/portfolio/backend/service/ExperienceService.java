package com.portfolio.backend.service;

import com.portfolio.backend.entity.Experience;
import com.portfolio.backend.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExperienceService {
    private final ExperienceRepository repository;

    public List<Experience> getAllExperience() {
        return repository.findAllByOrderByStartDateDesc();
    }

    public Experience saveExperience(Experience experience) {
        return repository.save(experience);
    }
    
    public void deleteExperience(UUID id) {
        repository.deleteById(id);
    }
}
