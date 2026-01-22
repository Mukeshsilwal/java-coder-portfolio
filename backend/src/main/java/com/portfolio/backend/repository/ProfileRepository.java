package com.portfolio.backend.repository;

import com.portfolio.backend.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    // There should typically be only one profile, so we might want a way to fetch 'the' profile easily
    // But standard JPA findAll or findById is sufficient for now.
}
