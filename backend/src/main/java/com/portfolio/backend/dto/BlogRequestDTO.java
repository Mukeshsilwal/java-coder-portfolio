package com.portfolio.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogRequestDTO {
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String coverImage;
    private Set<String> tags;
    private boolean published;
}
