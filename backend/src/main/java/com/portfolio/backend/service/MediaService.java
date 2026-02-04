package com.portfolio.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.portfolio.backend.entity.MediaFile;
import com.portfolio.backend.entity.MediaType;
import com.portfolio.backend.repository.MediaFileRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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

        try {
            // Upload to Cloudinary with correct parameters
            Map uploadParams = ObjectUtils.asMap(
                    "folder", folderPath,
                    "resource_type", type == MediaType.CV ? "raw" : "auto",
                    "use_filename", true,
                    "unique_filename", true,
                    "overwrite", false
            );

            // Add format for PDFs
            if (type == MediaType.CV) {
                uploadParams.put("format", "pdf");
            }

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
                    .active(true)
                    .build();

            return mediaFileRepository.save(mediaFile);

        } catch (IOException e) {
            throw new IOException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }
    }

    public MediaFile getActiveMediaByType(MediaType type) {
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