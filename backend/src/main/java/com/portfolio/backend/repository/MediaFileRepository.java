package com.portfolio.backend.repository;

import com.portfolio.backend.entity.MediaFile;
import com.portfolio.backend.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {
    List<MediaFile> findByFileType(MediaType fileType);
    Optional<MediaFile> findByPublicId(String publicId);
    List<MediaFile> findByActiveTrue();
    Optional<MediaFile> findTopByFileTypeAndActiveTrueOrderByUploadedAtDesc(MediaType fileType);
}
