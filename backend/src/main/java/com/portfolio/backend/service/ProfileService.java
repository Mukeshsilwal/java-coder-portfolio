package com.portfolio.backend.service;

import com.portfolio.backend.dto.ProfileDTO;
import com.portfolio.backend.entity.Profile;
import com.portfolio.backend.mapper.ProfileMapper;
import com.portfolio.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository repository;
    private final ProfileMapper mapper;

    public ProfileDTO getProfile() {
        return repository.findAll().stream()
                .findFirst()
                .map(mapper::toDto)
                .orElse(null);
    }

    public ProfileDTO updateProfile(ProfileDTO dto) {
        // Assume singleton profile for simplicity. 
        // If exists, update. If not, create.
        Profile existingOrNew;
        List<Profile> profiles = repository.findAll();
        if (profiles.isEmpty()) {
            existingOrNew = mapper.toEntity(dto);
        } else {
            existingOrNew = profiles.get(0);
            // Rudimentary update: could use MapStruct's update target
            existingOrNew.setHeadline(dto.getHeadline());
            existingOrNew.setBio(dto.getBio());
            existingOrNew.setYearsOfExperience(dto.getYearsOfExperience());
            existingOrNew.setResumeUrl(dto.getResumeUrl());
            existingOrNew.setGithubUrl(dto.getGithubUrl());
            existingOrNew.setLinkedinUrl(dto.getLinkedinUrl());
            existingOrNew.setPortfolioWebsite(dto.getPortfolioWebsite());
            existingOrNew.setLocation(dto.getLocation());
            existingOrNew.setPhone(dto.getPhone());
            existingOrNew.setEmail(dto.getEmail());
            existingOrNew.setProfileImage(dto.getProfileImage());
            existingOrNew.setAvailabilityStatus(dto.getAvailabilityStatus());
        }
        return mapper.toDto(repository.save(existingOrNew));
    }
    public String updateProfileImage(String imageUrl) {
        List<Profile> profiles = repository.findAll();
        Profile profile;
        if (profiles.isEmpty()) {
            profile = new Profile();
            // Initialize required fields if necessary or allow nulls
        } else {
            profile = profiles.get(0);
        }
        
        String oldUrl = profile.getProfileImageUrl();
        if (oldUrl == null) oldUrl = profile.getProfileImage(); // Fallback to old field if needed
        
        profile.setProfileImageUrl(imageUrl);
        profile.setProfileImage(imageUrl); // Sync for backward compatibility
        repository.save(profile);
        
        return oldUrl;
    }
}
