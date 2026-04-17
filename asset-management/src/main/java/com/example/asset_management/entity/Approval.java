package com.example.asset_management.entity;

import com.example.asset_management.entity.ServiceRequest;
import com.example.asset_management.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "approvals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Approval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long approvalId;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private ServiceRequest request;

    @ManyToOne
    @JoinColumn(name = "approved_by", nullable = false)
    private User approvedBy;

    @Column(nullable = false)
    private String approvalStatus = "PENDING";   // PENDING, APPROVED, REJECTED

    private LocalDateTime approvedAt = LocalDateTime.now();
}