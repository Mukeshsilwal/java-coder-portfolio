package com.portfolio.backend.mapper;

import com.portfolio.backend.dto.ProfileDTO;
import com.portfolio.backend.entity.Profile;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-23T14:24:05+0545",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class ProfileMapperImpl implements ProfileMapper {

    @Override
    public ProfileDTO toDto(Profile profile) {
        if ( profile == null ) {
            return null;
        }

        ProfileDTO profileDTO = new ProfileDTO();

        profileDTO.setId( profile.getId() );
        profileDTO.setHeadline( profile.getHeadline() );
        profileDTO.setBio( profile.getBio() );
        profileDTO.setYearsOfExperience( profile.getYearsOfExperience() );
        profileDTO.setResumeUrl( profile.getResumeUrl() );
        profileDTO.setGithubUrl( profile.getGithubUrl() );
        profileDTO.setLinkedinUrl( profile.getLinkedinUrl() );
        profileDTO.setPortfolioWebsite( profile.getPortfolioWebsite() );
        profileDTO.setLocation( profile.getLocation() );
        profileDTO.setPhone( profile.getPhone() );
        profileDTO.setEmail( profile.getEmail() );
        profileDTO.setProfileImage( profile.getProfileImage() );
        profileDTO.setAvailabilityStatus( profile.getAvailabilityStatus() );

        return profileDTO;
    }

    @Override
    public Profile toEntity(ProfileDTO profileDTO) {
        if ( profileDTO == null ) {
            return null;
        }

        Profile.ProfileBuilder profile = Profile.builder();

        profile.id( profileDTO.getId() );
        profile.headline( profileDTO.getHeadline() );
        profile.bio( profileDTO.getBio() );
        profile.yearsOfExperience( profileDTO.getYearsOfExperience() );
        profile.resumeUrl( profileDTO.getResumeUrl() );
        profile.githubUrl( profileDTO.getGithubUrl() );
        profile.linkedinUrl( profileDTO.getLinkedinUrl() );
        profile.portfolioWebsite( profileDTO.getPortfolioWebsite() );
        profile.location( profileDTO.getLocation() );
        profile.phone( profileDTO.getPhone() );
        profile.email( profileDTO.getEmail() );
        profile.profileImage( profileDTO.getProfileImage() );
        profile.availabilityStatus( profileDTO.getAvailabilityStatus() );

        return profile.build();
    }
}
