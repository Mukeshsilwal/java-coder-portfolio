package com.portfolio.backend.mapper;

import com.portfolio.backend.dto.SkillDTO;
import com.portfolio.backend.entity.Skill;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-24T10:01:11+0545",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class SkillMapperImpl implements SkillMapper {

    @Override
    public SkillDTO toDto(Skill skill) {
        if ( skill == null ) {
            return null;
        }

        SkillDTO skillDTO = new SkillDTO();

        skillDTO.setId( skill.getId() );
        skillDTO.setSkillName( skill.getSkillName() );
        skillDTO.setCategory( skill.getCategory() );
        skillDTO.setProficiencyLevel( skill.getProficiencyLevel() );
        skillDTO.setExperienceYears( skill.getExperienceYears() );
        skillDTO.setIconUrl( skill.getIconUrl() );
        skillDTO.setDisplayOrder( skill.getDisplayOrder() );

        return skillDTO;
    }

    @Override
    public Skill toEntity(SkillDTO skillDTO) {
        if ( skillDTO == null ) {
            return null;
        }

        Skill.SkillBuilder skill = Skill.builder();

        skill.id( skillDTO.getId() );
        skill.skillName( skillDTO.getSkillName() );
        skill.category( skillDTO.getCategory() );
        skill.proficiencyLevel( skillDTO.getProficiencyLevel() );
        skill.experienceYears( skillDTO.getExperienceYears() );
        skill.iconUrl( skillDTO.getIconUrl() );
        skill.displayOrder( skillDTO.getDisplayOrder() );

        return skill.build();
    }
}
