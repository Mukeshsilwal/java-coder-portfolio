package com.portfolio.backend.repository;

import com.portfolio.backend.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {
}
