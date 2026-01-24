package com.portfolio.backend.service;

import com.portfolio.backend.entity.ContactMessage;
import com.portfolio.backend.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional
public class ContactService {

    private final ContactMessageRepository repository;

    public ContactMessage saveMessage(ContactMessage message) {
        return repository.save(message);
    }

    public List<ContactMessage> getAllMessages() {
        return repository.findAll();
    }
    
    public void deleteMessage(java.util.UUID id) {
        repository.deleteById(id);
    }

    public ContactMessage markMessageAsRead(java.util.UUID id) {
        ContactMessage message = repository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Message not found with id: " + id));
        message.setRead(true);
        return repository.save(message);
    }
}
