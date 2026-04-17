package com.example.asset_management.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssetDTO {
    private Long assetId;
    private String assetName;
    private String assetTag;
    private String assetType;
    private LocalDate purchaseDate;
    private String status;
    private Long categoryId;
    private Long departmentId;
}