package com.portfolio.backend.mapper;

import com.portfolio.backend.dto.ProjectDTO;
import com.portfolio.backend.entity.Project;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    ProjectDTO toDto(Project project);
    Project toEntity(ProjectDTO projectDTO);
}
