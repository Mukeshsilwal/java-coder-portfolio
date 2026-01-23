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
        // Validation handled in MediaService generally, but double check type here if strictly Resume
        // MediaService handles upload and sets previous CVs to inactive in MediaFile table.
        // We also need to update Resume table.
        
        resumeRepository.deactivateAll(); // Validating existing logic
        
        MediaFile media = mediaService.uploadMedia(file, MediaType.CV);

        Resume resume = Resume.builder()
                .fileName(file.getOriginalFilename())
                .filePath(media.getPublicId()) // Storing publicId in filePath for backward comp if needed
                .publicId(media.getPublicId())
                .url(media.getUrl())
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

    // Changed from returning Resource to returning URL String
    public String getActiveResumeUrl() {
        Resume resume = getActiveResumeMetadata();
        return resume.getUrl();
    }

    @Transactional
    public void deleteActiveResume() {
        Resume resume = getActiveResumeMetadata();
        // Soft delete in Resume table
        resume.setIsActive(false);
        resumeRepository.save(resume);
        
        // Should we delete from Cloudinary?
        // Requirement: "Replace old CV on new upload". 
        // Logic in MediaService.uploadMedia handles deactivating "MediaFile".
        // Here we just update Resume entity status.
    }

    @Transactional
    public void incrementDownloadCount() {
        resumeRepository.findByIsActiveTrue().ifPresent(resume -> {
            resume.setDownloadCount(resume.getDownloadCount() + 1);
            resumeRepository.save(resume);
        });
    }
}
