package com.portfolio.backend.service;

import com.portfolio.backend.entity.MediaFile;
import com.portfolio.backend.entity.MediaType;
import com.portfolio.backend.repository.MediaFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final CloudinaryService cloudinaryService;
    private final MediaFileRepository mediaFileRepository;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @Transactional
    public MediaFile uploadMedia(MultipartFile file, MediaType type) {
        validateFile(file, type);

        String folder = getFolderForType(type);
        // Force 'raw' for CVs to ensure predictable public URL access without image transformation constraints
        String resourceType = (type == MediaType.CV) ? "raw" : "auto";

        // If Image, restrict formats? User said: jpg, png, webp, svg for Images. pdf, docx for CV.
        
        // If CV, deactivate previous active CV
        if (type == MediaType.CV) {
            List<MediaFile> activeCvs = mediaFileRepository.findTopByFileTypeAndActiveTrueOrderByUploadedAtDesc(MediaType.CV).stream().toList();
            activeCvs.forEach(cv -> {
                cv.setActive(false);
                mediaFileRepository.save(cv);
            });
        }

        Map uploadResult = cloudinaryService.uploadFile(file, folder, resourceType);
        String url = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        MediaFile mediaFile = MediaFile.builder()
                .fileType(type)
                .url(url)
                .publicId(publicId)
                .active(true)
                .build();

        return mediaFileRepository.save(mediaFile);
    }
    
    @Transactional
    public void deleteMedia(Long id) {
        MediaFile media = mediaFileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found"));
        
        // Delete from Cloudinary
        // Note: For 'raw' or 'auto', deletion might need resource_type specified differently if it wasn't valid.
        // Assuming 'image' normally. If CV, it might be raw/image. 
        // We might need to store resource_type in DB to delete correctly? 
        // Or just try both or assume based on fileType.
        
        String resourceType = (media.getFileType() == MediaType.CV) ? "raw" : "image";
        // Correction: if we uploaded as 'auto', Cloudinary determines it.
        // If it's a PDF, it is often 'image' if we want page extraction, or 'raw'.
        // Let's assume 'image' for images and 'raw' for docs unless we check extension.
        // Actually, for delete, we usually need to know.
        // Safest is to try to delete based on type.
        
        cloudinaryService.deleteFile(media.getPublicId(), resourceType);
        
        mediaFileRepository.delete(media);
    }

    public List<MediaFile> getAllMedia(MediaType type) {
        if (type == null) {
            return mediaFileRepository.findAll();
        }
        return mediaFileRepository.findByFileType(type);
    }
    
    public MediaFile getActiveCv() {
        return mediaFileRepository.findTopByFileTypeAndActiveTrueOrderByUploadedAtDesc(MediaType.CV)
                .orElseThrow(() -> new RuntimeException("No active CV found"));
    }

    private void validateFile(MultipartFile file, MediaType type) {
        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds 5MB limit. Please upload a smaller file.");
        }
        
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty. Please select a valid file.");
        }
        
        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();
        
        if (type == MediaType.CV) {
            // Validate CV file types: PDF and DOCX
            boolean isValidCV = false;
            
            if (contentType != null) {
                isValidCV = contentType.equals("application/pdf") ||
                           contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                           contentType.equals("application/msword");
            }
            
            // Fallback to extension check
            if (!isValidCV && fileName != null) {
                String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
                isValidCV = extension.equals("pdf") || extension.equals("docx") || extension.equals("doc");
            }
            
            if (!isValidCV) {
                throw new RuntimeException("Invalid file type for CV. Only PDF and DOCX files are allowed.");
            }
        } else if (type == MediaType.IMAGE) {
            // Validate image file types: jpg, png, webp, svg
            boolean isValidImage = false;
            
            if (contentType != null) {
                isValidImage = contentType.equals("image/jpeg") ||
                              contentType.equals("image/png") ||
                              contentType.equals("image/webp") ||
                              contentType.equals("image/svg+xml");
            }
            
            // Fallback to extension check
            if (!isValidImage && fileName != null) {
                String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
                isValidImage = extension.equals("jpg") || extension.equals("jpeg") || 
                              extension.equals("png") || extension.equals("webp") || 
                              extension.equals("svg");
            }
            
            if (!isValidImage) {
                throw new RuntimeException("Invalid file type for image. Only JPG, PNG, WEBP, and SVG files are allowed.");
            }
        }
    }

    private String getFolderForType(MediaType type) {
        switch (type) {
            case CV: return "portfolio/cv";
            case IMAGE: return "portfolio/profile"; // Defaulting to profile, but could be others
            default: return "portfolio/uploads";
        }
    }

    @Transactional
    public void deleteMediaByPublicId(String publicId) {
        // Try to find in DB first
        Optional<MediaFile> media = mediaFileRepository.findByPublicId(publicId);
        if (media.isPresent()) {
            deleteMedia(media.get().getId());
        } else {
            // Fallback: Delete generic image from cloudinary directly
            cloudinaryService.deleteFile(publicId, "image");
        }
    }

    @Transactional
    public void deleteMediaByUrl(String url) {
        String publicId = cloudinaryService.extractPublicIdFromUrl(url);
        if (publicId != null) {
            deleteMediaByPublicId(publicId);
        }
    }
    
    // Support for specifying folder for images (projects vs profile)
    @Transactional
    public MediaFile uploadImage(MultipartFile file, String subFolder) {
         validateFile(file, MediaType.IMAGE);
         String folder = "portfolio/" + subFolder;
         
         Map uploadResult = cloudinaryService.uploadFile(file, folder, "image");
         String url = (String) uploadResult.get("secure_url");
         String publicId = (String) uploadResult.get("public_id");

         MediaFile mediaFile = MediaFile.builder()
                .fileType(MediaType.IMAGE)
                .url(url)
                .publicId(publicId)
                .active(true)
                .build();

        return mediaFileRepository.save(mediaFile);
    }
}
