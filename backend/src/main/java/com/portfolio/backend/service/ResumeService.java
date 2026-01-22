package com.portfolio.backend.service;

import com.portfolio.backend.entity.Resume;
import com.portfolio.backend.repository.ResumeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final StorageService storageService;

    @Transactional
    public Resume uploadResume(MultipartFile file, String username) throws IOException {
        // Validate MIME type
        if (!"application/pdf".equals(file.getContentType())) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }
        
        // Deactivate old resumes
        resumeRepository.deactivateAll();

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) originalFilename = "resume.pdf";
        String storedFilename = UUID.randomUUID() + "_" + originalFilename;

        // Store file
        String filePath = storageService.store(file, storedFilename);

        // Save metadata
        Resume resume = Resume.builder()
                .fileName(originalFilename)
                .filePath(storedFilename) // Storing the relative/key name for retrieval
                .fileSize(file.getSize())
                .contentType(file.getContentType())
                .uploadedBy(username)
                .isActive(true)
                .build();

        return resumeRepository.save(resume);
    }

    public Resume getActiveResumeMetadata() {
        return resumeRepository.findByIsActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active resume found"));
    }

    public Resource getActiveResumeResource() {
        Resume resume = getActiveResumeMetadata();
        return storageService.loadAsResource(resume.getFilePath());
    }

    @Transactional
    public void deleteActiveResume() {
        Resume resume = getActiveResumeMetadata();
        // Soft delete: just deactivate. File is kept for history/auditing.
        resume.setIsActive(false);
        resumeRepository.save(resume);
    }
}
