package com.portfolio.backend.controller;

import com.portfolio.backend.common.ApiResponse;
import com.portfolio.backend.entity.BlogPost;
import com.portfolio.backend.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService service;

    // Public: Get published blogs
    @GetMapping
    public ResponseEntity<ApiResponse<Page<BlogPost>>> getBlogs(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success("Published blogs retrieved successfully", service.getPublishedPosts(pageable)));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<BlogPost>> getBlogBySlug(@PathVariable String slug) {
        return service.getPostBySlug(slug)
                .map(post -> ResponseEntity.ok(ApiResponse.success("Blog post retrieved successfully", post)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: Get all blogs (including drafts)
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<BlogPost>>> getAllBlogsAdmin(
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success("All blogs retrieved successfully", service.getAllPosts(pageable)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BlogPost>> createPost(@RequestBody BlogPost post) {
        return ResponseEntity.ok(ApiResponse.success("Blog post created successfully", service.createPost(post)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BlogPost>> updatePost(@PathVariable UUID id, @RequestBody BlogPost post) {
        return ResponseEntity.ok(ApiResponse.success("Blog post updated successfully", service.updatePost(id, post)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable UUID id) {
        service.deletePost(id);
        return ResponseEntity.ok(ApiResponse.success("Blog post deleted successfully", null));
    }
}
