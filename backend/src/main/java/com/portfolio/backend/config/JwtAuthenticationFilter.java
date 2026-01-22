package com.portfolio.backend.config;

import com.portfolio.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        String token = null;
        
        System.out.println("JwtAuthFilter: Processing request " + request.getRequestURI());

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            System.out.println("JwtAuthFilter: Found Bearer token");
        } else if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    token = cookie.getValue();
                    System.out.println("JwtAuthFilter: Found Cookie token");
                    break;
                }
            }
        } else {
             System.out.println("JwtAuthFilter: No cookies found");
        }

        if (token == null) {
            System.out.println("JwtAuthFilter: Token is null, continuing chain");
            filterChain.doFilter(request, response);
            return;
        }
        
        jwt = token;
        try {
            userEmail = jwtService.extractUsername(jwt);
            System.out.println("JwtAuthFilter: User email from token: " + userEmail);
            
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("JwtAuthFilter: Authenticated user " + userEmail + " with authorities: " + userDetails.getAuthorities());
                } else {
                     System.out.println("JwtAuthFilter: Invalid token");
                }
            }
        } catch (Exception e) {
            System.out.println("JwtAuthFilter: Error processing token: " + e.getMessage());
        }
        filterChain.doFilter(request, response);
    }
}
