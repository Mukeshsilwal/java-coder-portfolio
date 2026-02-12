package com.portfolio.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.portfolio.backend.entity.MediaFile;
import com.portfolio.backend.entity.MediaType;
import com.portfolio.backend.repository.MediaFileRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final Cloudinary cloudinary;
    private final MediaFileRepository mediaFileRepository;

    public MediaFile getMediaById(Long id) {
        return mediaFileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media file not found"));
    }

    @Transactional
    public MediaFile uploadMedia(MultipartFile file, MediaType type) throws IOException {
        String subFolder = type == MediaType.CV ? "resumes" : "general";
        if (type == MediaType.IMAGE) subFolder = "images";
        return uploadMedia(file, type, "portfolio/" + subFolder);
    }

    @Transactional
    public MediaFile uploadImage(MultipartFile file, String folder) {
        try {
            return uploadMedia(file, MediaType.IMAGE, "portfolio/" + folder);
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    @Transactional
    public MediaFile uploadMedia(MultipartFile file, MediaType type, String folderPath) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type for CV
        if (type == MediaType.CV && !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed for CV");
        }

        // Deactivate previous files of the same type
        if (type == MediaType.CV) {
            List<MediaFile> activeFiles = mediaFileRepository.findByFileTypeAndActiveTrue(MediaType.CV);
            activeFiles.forEach(media -> {
                media.setActive(false);
                mediaFileRepository.save(media);
            });
        }

        // Handle CVs in Database (BLOB) - Single File Policy
        if (type == MediaType.CV) {
            final String FIXED_CV_ID = "CV_FILE";

            // Check if CV already exists
            MediaFile mediaFile = mediaFileRepository.findByPublicId(FIXED_CV_ID)
                    .orElse(MediaFile.builder()
                            .publicId(FIXED_CV_ID)
                            .fileType(MediaType.CV)
                            .url("/api/public/media/cv/download")
                            .build());

            // Update fields (whether new or existing)
            mediaFile.setData(file.getBytes());
            mediaFile.setFileSize(file.getSize());
            mediaFile.setFileName(file.getOriginalFilename());
            mediaFile.setActive(true);
            mediaFile.setUploadedAt(java.time.LocalDateTime.now()); // Update timestamp to show "Fresh" status

            // Save (Update or Create)
            MediaFile savedFile = mediaFileRepository.save(mediaFile);

            // Cleanup: Deactivate/Delete any other CV files (legacy cleanup)
            List<MediaFile> otherFiles = mediaFileRepository.findByFileTypeAndActiveTrue(MediaType.CV);
            for (MediaFile f : otherFiles) {
                if (!f.getPublicId().equals(FIXED_CV_ID)) {
                    // Safe cleanup: just deactivate or delete. User said "replace".
                    // We'll delete them to strictly follow "Only one CV in the entire system"
                    try {
                         mediaFileRepository.delete(f);
                    } catch (Exception e) {
                        // ignore
                    }
                }
            }
            
            return savedFile;
        }

        try {
            // Upload to Cloudinary for other types (images)
            Map uploadParams = ObjectUtils.asMap(
                    "folder", folderPath,
                    "resource_type", "auto",
                    "use_filename", true,
                    "unique_filename", true,
                    "overwrite", false
            );

            // Upload file
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);

            // Extract results
            String publicId = (String) uploadResult.get("public_id");
            String url = (String) uploadResult.get("secure_url");

            // Build MediaFile entity
            MediaFile mediaFile = MediaFile.builder()
                    .publicId(publicId)
                    .url(url)
                    .fileType(type)
                    .fileSize(file.getSize())
                    .fileName(file.getOriginalFilename())
                    .active(true)
                    .build();

            return mediaFileRepository.save(mediaFile);

        } catch (IOException e) {
            throw new IOException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }
    }

    public MediaFile getActiveMediaByType(MediaType type) {
        if (type == MediaType.CV) {
            final String FIXED_CV_ID = "CV_FILE";
            // Check for specific CV ID first
            return mediaFileRepository.findByPublicId(FIXED_CV_ID)
                    .filter(MediaFile::isActive)
                    .orElse(mediaFileRepository.findTopByFileTypeAndActiveTrueOrderByUploadedAtDesc(type)
                            .orElseThrow(() -> new RuntimeException("No active " + type + " found")));
        }
        return mediaFileRepository.findTopByFileTypeAndActiveTrueOrderByUploadedAtDesc(type)
                .orElseThrow(() -> new RuntimeException("No active " + type + " found"));
    }

    public List<MediaFile> getAllMediaByType(MediaType type) {
        return mediaFileRepository.findByFileTypeOrderByUploadedAtDesc(type);
    }

    public List<MediaFile> getAllActiveMedia() {
        return mediaFileRepository.findByActiveTrue();
    }

    @Transactional
    public void deleteMedia(String publicId) throws IOException {
        MediaFile mediaFile = mediaFileRepository.findByPublicId(publicId)
                .orElseThrow(() -> new RuntimeException("Media file not found"));

        // Delete from Cloudinary
        try {
            Map params = ObjectUtils.asMap(
                    "resource_type", mediaFile.getFileType() == MediaType.CV ? "raw" : "image"
            );
            cloudinary.uploader().destroy(publicId, params);
        } catch (Exception e) {
            throw new IOException("Failed to delete from Cloudinary: " + e.getMessage());
        }

        // Delete from database
        mediaFileRepository.delete(mediaFile);
    }

    @Transactional
    public void deleteMediaByPublicId(String publicId) {
        try {
            deleteMedia(publicId);
        } catch (IOException e) {
            throw new RuntimeException("Deletion failed for publicId: " + publicId);
        }
    }

    @Transactional
    public void deleteMediaByUrl(String url) {
        mediaFileRepository.findByUrl(url).ifPresent(media -> {
            try {
                deleteMedia(media.getPublicId());
            } catch (IOException e) {
                // Log error but maybe don't stall the whole process if it's just a cleanup
            }
        });
    }

    @Transactional
    public void deactivateMedia(String publicId) {
        MediaFile mediaFile = mediaFileRepository.findByPublicId(publicId)
                .orElseThrow(() -> new RuntimeException("Media file not found"));

        mediaFile.setActive(false);
        mediaFileRepository.save(mediaFile);
    }

    public long countActiveByType(MediaType type) {
        return mediaFileRepository.countByFileTypeAndActiveTrue(type);
    }
}