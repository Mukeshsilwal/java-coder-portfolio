package com.portfolio.backend.mapper;

import com.portfolio.backend.dto.ProjectDTO;
import com.portfolio.backend.entity.Project;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-24T08:46:04+0545",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class ProjectMapperImpl implements ProjectMapper {

    @Override
    public ProjectDTO toDto(Project project) {
        if ( project == null ) {
            return null;
        }

        ProjectDTO projectDTO = new ProjectDTO();

        projectDTO.setId( project.getId() );
        projectDTO.setTitle( project.getTitle() );
        projectDTO.setDescription( project.getDescription() );
        projectDTO.setTechStack( project.getTechStack() );
        projectDTO.setGithubRepoUrl( project.getGithubRepoUrl() );
        projectDTO.setLiveDemoUrl( project.getLiveDemoUrl() );
        projectDTO.setProjectImage( project.getProjectImage() );
        if ( project.getProjectType() != null ) {
            projectDTO.setProjectType( project.getProjectType().name() );
        }
        projectDTO.setStartDate( project.getStartDate() );
        projectDTO.setEndDate( project.getEndDate() );
        projectDTO.setIsFeatured( project.getIsFeatured() );

        return projectDTO;
    }

    @Override
    public Project toEntity(ProjectDTO projectDTO) {
        if ( projectDTO == null ) {
            return null;
        }

        Project.ProjectBuilder project = Project.builder();

        project.id( projectDTO.getId() );
        project.title( projectDTO.getTitle() );
        project.description( projectDTO.getDescription() );
        project.techStack( projectDTO.getTechStack() );
        project.githubRepoUrl( projectDTO.getGithubRepoUrl() );
        project.liveDemoUrl( projectDTO.getLiveDemoUrl() );
        project.projectImage( projectDTO.getProjectImage() );
        if ( projectDTO.getProjectType() != null ) {
            project.projectType( Enum.valueOf( Project.ProjectType.class, projectDTO.getProjectType() ) );
        }
        project.startDate( projectDTO.getStartDate() );
        project.endDate( projectDTO.getEndDate() );
        project.isFeatured( projectDTO.getIsFeatured() );

        return project.build();
    }
}
