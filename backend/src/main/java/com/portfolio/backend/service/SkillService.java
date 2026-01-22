package com.portfolio.backend.service;

import com.portfolio.backend.dto.SkillDTO;
import com.portfolio.backend.entity.Skill;
import com.portfolio.backend.mapper.SkillMapper;
import com.portfolio.backend.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {
    private final SkillRepository repository;
    private final SkillMapper mapper;

    public List<SkillDTO> getAllSkills() {
        return repository.findAllByOrderByDisplayOrderAsc().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public SkillDTO createSkill(SkillDTO dto) {
        Skill entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    public void deleteSkill(UUID id) {
        repository.deleteById(id);
    }
    
    public String updateSkillIcon(UUID id, String imageUrl) {
        Skill skill = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        
        String oldUrl = skill.getIconUrl();
        skill.setIconUrl(imageUrl);
        repository.save(skill);
        return oldUrl;
    }
}
