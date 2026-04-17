package com.example.asset_management.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequestDTO {
    private Long requestId;
    private String title;
    private String description;
    private String category;
    private String priority;
    private LocalDateTime createdAt;
    private String statusName;
    private Long assetId;
}