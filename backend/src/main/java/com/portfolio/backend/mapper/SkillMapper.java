package com.portfolio.backend.mapper;

import com.portfolio.backend.dto.SkillDTO;
import com.portfolio.backend.entity.Skill;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SkillMapper {
    SkillDTO toDto(Skill skill);
    Skill toEntity(SkillDTO skillDTO);
}
