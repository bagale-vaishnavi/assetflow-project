package com.example.asset_management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "request_status")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer statusId;

    @Column(nullable = false, unique = true, length = 50)
    private String statusName;   // Pending, Approved, Rejected, In Progress, Completed, Cancelled
}