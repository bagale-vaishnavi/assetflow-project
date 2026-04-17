package com.example.asset_management.entity;

import com.example.asset_management.entity.Asset;
import com.example.asset_management.entity.RequestStatus;
import com.example.asset_management.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String category;   // Hardware, Software, Network, etc.

    private String priority;   // Low, Medium, High

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "status_id")
    private RequestStatus status;

    @ManyToOne
    @JoinColumn(name = "asset_id")
    private Asset asset;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;   // who raised the request
}