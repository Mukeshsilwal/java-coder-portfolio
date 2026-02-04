package com.portfolio.backend.repository;

import com.portfolio.backend.entity.MediaFile;
import com.portfolio.backend.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {

    // Find by file type
    List<MediaFile> findByFileType(MediaType fileType);

    // Find by file type and active status
    List<MediaFile> findByFileTypeAndActiveTrue(MediaType fileType);

    // Find by public ID
    Optional<MediaFile> findByPublicId(String publicId);

    // Find by URL
    Optional<MediaFile> findByUrl(String url);

    // Find all active files
    List<MediaFile> findByActiveTrue();

    // Find top by file type and active, ordered by upload date
    Optional<MediaFile> findTopByFileTypeAndActiveTrueOrderByUploadedAtDesc(MediaType fileType);

    // Custom query to deactivate all files of a specific type
    @Modifying
    @Query("UPDATE MediaFile m SET m.active = false WHERE m.fileType = :fileType AND m.active = true")
    void deactivateAllByFileType(@Param("fileType") MediaType fileType);

    // Find by file type, ordered by upload date
    List<MediaFile> findByFileTypeOrderByUploadedAtDesc(MediaType fileType);

    // Count active files by file type
    long countByFileTypeAndActiveTrue(MediaType fileType);

    // Delete by public ID
    void deleteByPublicId(String publicId);

    // Find all inactive files (for cleanup)
    List<MediaFile> findByActiveFalse();

    // Find by file type and active false (for cleanup)
    List<MediaFile> findByFileTypeAndActiveFalse(MediaType fileType);
}