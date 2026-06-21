package com.example.asset_management.entity;

import com.example.asset_management.entity.AssetCategory;
import com.example.asset_management.entity.Department;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assetId;

    @Column(nullable = false)
    private String assetName;

    @Column(nullable = false, unique = true)
    private String assetTag;

    private String assetType;   // Hardware, Software, etc.

    private LocalDate purchaseDate;

    @Column(nullable = false)
    private String status = "Available";   // Available, In Use, Under Maintenance, Retired

    @ManyToOne
    @JoinColumn(name = "category_id")
    private AssetCategory category;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    @Column(nullable = false)
    private Integer quantity = 1;
}