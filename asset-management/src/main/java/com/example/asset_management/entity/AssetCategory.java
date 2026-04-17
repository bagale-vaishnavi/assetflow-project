package com.example.asset_management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "asset_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssetCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Column(nullable = false, length = 100)
    private String categoryName;   // Electronics, Furniture, Vehicles, etc.
}