package com.portfolio.backend.service;

import com.portfolio.backend.entity.MediaFile;
import com.portfolio.backend.entity.MediaType;
import com.portfolio.backend.entity.Resume;
import com.portfolio.backend.repository.ResumeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final MediaService mediaService;

    @Transactional
    public Resume uploadResume(MultipartFile file, String username) throws IOException {
        // Validate PDF
        if (!file.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        // Deactivate all existing resumes
        resumeRepository.deactivateAll();

        // Upload to Cloudinary via MediaService
        MediaFile media = mediaService.uploadMedia(file, MediaType.CV);

        // Create Resume entity with BLOB data
        Resume resume = Resume.builder()
                .fileName(file.getOriginalFilename())
                .filePath(media.getPublicId())
                .publicId(media.getPublicId())
                .url(media.getUrl())
                .data(file.getBytes()) // Store bytes directly in DB
                .fileSize(file.getSize())
                .contentType(file.getContentType())
                .uploadedBy(username)
                .isActive(true)
                .downloadCount(0L)
                .build();

        return resumeRepository.save(resume);
    }

    public Resume getActiveResumeMetadata() {
        return resumeRepository.findTopByIsActiveTrueOrderByUploadedAtDesc()
                .orElseThrow(() -> new RuntimeException("No active resume found"));
    }

    public String getActiveResumeUrl() {
        Resume resume = getActiveResumeMetadata();
        return resume.getUrl();
    }

    @Transactional
    public void deleteActiveResume() {
        Resume resume = getActiveResumeMetadata();
        resume.setIsActive(false);
        resumeRepository.save(resume);

        // Also deactivate in MediaFile table
        try {
            mediaService.deactivateMedia(resume.getPublicId());
        } catch (Exception e) {
            // Log error but don't fail the operation
            System.err.println("Failed to deactivate media file: " + e.getMessage());
        }
    }

    @Transactional
    public void incrementDownloadCount() {
        resumeRepository.findByIsActiveTrue().ifPresent(resume -> {
            resume.setDownloadCount(resume.getDownloadCount() + 1);
            resumeRepository.save(resume);
        });
    }

    public Resume getLatestResumeForUser(String username) {
        return resumeRepository.findTopByUploadedByOrderByUploadedAtDesc(username)
                .orElseThrow(() -> new RuntimeException("No resume found for user: " + username));
    }
}