package com.portfolio.backend.service;

import com.portfolio.backend.entity.BlogPost;
import com.portfolio.backend.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlogService {
    private final BlogPostRepository repository;

    public Page<BlogPost> getAllPosts(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Page<BlogPost> getPublishedPosts(Pageable pageable) {
        return repository.findByIsPublishedTrue(pageable);
    }

    public Optional<BlogPost> getPostBySlug(String slug) {
        Optional<BlogPost> post = repository.findBySlug(slug);
        post.ifPresent(p -> {
            p.setViewCount(p.getViewCount() + 1);
            repository.save(p);
        });
        return post;
    }
    
    public Optional<BlogPost> getPostById(UUID id) {
        return repository.findById(id);
    }

    public BlogPost createPost(BlogPost post) {
        // Simple slug generation
        if (post.getSlug() == null || post.getSlug().isEmpty()) {
            post.setSlug(post.getTitle().toLowerCase().replace(" ", "-"));
        }
        return repository.save(post);
    }

    public BlogPost updatePost(UUID id, BlogPost updated) {
        return repository.findById(id).map(post -> {
            post.setTitle(updated.getTitle());
            post.setContent(updated.getContent());
            post.setExcerpt(updated.getExcerpt());
            post.setPublished(updated.isPublished());
            post.setTags(updated.getTags());
            post.setCoverImage(updated.getCoverImage());
            return repository.save(post);
        }).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public void deletePost(UUID id) {
        repository.deleteById(id);
    }
    public String updateBlogThumbnail(UUID id, String imageUrl) {
        BlogPost post = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        String oldUrl = post.getThumbnailUrl(); // Assuming I added this field
        if (oldUrl == null) oldUrl = post.getCoverImage();
        
        post.setThumbnailUrl(imageUrl);
        post.setCoverImage(imageUrl); // Sync
        repository.save(post);
        
        return oldUrl;
    }
}
