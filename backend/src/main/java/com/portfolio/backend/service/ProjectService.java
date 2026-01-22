package com.portfolio.backend.service;

import com.portfolio.backend.dto.ProjectDTO;
import com.portfolio.backend.entity.Project;
import com.portfolio.backend.mapper.ProjectMapper;
import com.portfolio.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository repository;
    private final ProjectMapper mapper;

    public List<ProjectDTO> getAllProjects() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public ProjectDTO getProjectById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public ProjectDTO createProject(ProjectDTO dto) {
        Project entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    public ProjectDTO updateProject(UUID id, ProjectDTO dto) {
        Project existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setTechStack(dto.getTechStack());
        existing.setGithubRepoUrl(dto.getGithubRepoUrl());
        existing.setLiveDemoUrl(dto.getLiveDemoUrl());
        existing.setProjectImage(dto.getProjectImage());
        if (dto.getProjectType() != null) {
            existing.setProjectType(com.portfolio.backend.entity.Project.ProjectType.valueOf(dto.getProjectType()));
        }
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        existing.setIsFeatured(dto.getIsFeatured());

        return mapper.toDto(repository.save(existing));
    }

    public void deleteProject(UUID id) {
        repository.deleteById(id);
    }
}
