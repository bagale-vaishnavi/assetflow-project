package com.example.asset_management.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generate Token - Updated builder style
    public String generateToken(UserDetailsImpl userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())                    // was setSubject
                .claim("userId", userDetails.getUserId())
                .claim("role", userDetails.getRole())
                .issuedAt(new Date())                                  // was setIssuedAt
                .expiration(new Date(System.currentTimeMillis() + expiration))  // was setExpiration
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        return extractClaims(token).get("userId", Long.class);
    }

    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) getSigningKey())      // Modern way instead of parserBuilder + setSigningKey
                    .build()
                    .parseSignedClaims(token);        // Modern way instead of parseClaimsJws
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();                    // Modern way: getPayload() instead of getBody()
    }
}