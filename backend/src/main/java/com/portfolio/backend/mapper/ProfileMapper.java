package com.portfolio.backend.mapper;

import com.portfolio.backend.dto.ProfileDTO;
import com.portfolio.backend.entity.Profile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileDTO toDto(Profile profile);
    Profile toEntity(ProfileDTO profileDTO);
}
