package com.example.asset_management.controller;


import com.example.asset_management.entity.Asset;
import com.example.asset_management.entity.AssetAssignment;
import com.example.asset_management.entity.AssetCategory;
import com.example.asset_management.repository.AssetAssignmentRepository;
import com.example.asset_management.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Scanner;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class AssetController {

    @Autowired
    private AssetAssignmentRepository assetAssignmentRepository;

    @Autowired
    private AssetService assetService;
    // Admin: Add new asset
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Asset> addAsset(@RequestBody Asset asset) {
        System.out.println("ADD ASSET CONTROLLER HIT");
        Asset saved = assetService.addAsset(asset);
        return ResponseEntity.ok(saved);
    }

    // All authenticated users can view assets
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    // Get only available assets (useful for employees)
    @GetMapping("/available")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Asset>> getAvailableAssets() {
        return ResponseEntity.ok(assetService.getAvailableAssets());
    }

    // Admin: Assign asset to employee
    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> assignAsset(
            @RequestParam Long assetId,
            @RequestParam Long empId) {

        try {
            assetService.assignAsset(assetId, empId);
            return ResponseEntity.ok("Asset assigned successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to assign asset");
        }
    }

    // Admin: Update asset status
    @PutMapping("/{assetId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateAssetStatus(
            @PathVariable Long assetId,
            @RequestParam String status) {
        assetService.updateAssetStatus(assetId, status);
        return ResponseEntity.ok("Asset status updated successfully");
    }
    @GetMapping("/asset-assignments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AssetAssignment>> getAllAssignments() {
        return ResponseEntity.ok(assetAssignmentRepository.findAll());
    }
    @GetMapping("/debug-auth")
    public String debugAuth(Authentication authentication) {
        System.out.println("Authorities: " + authentication.getAuthorities());
        return authentication.getAuthorities().toString();
    }
    @DeleteMapping("/{assetId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAsset(@PathVariable Long assetId) {
        assetService.deleteAsset(assetId);
        return ResponseEntity.ok("Asset deleted successfully");
    }

    @PutMapping("/{assetId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Asset> updateAsset(
            @PathVariable Long assetId,
            @RequestBody Asset updatedAsset) {

        try {
            Asset asset = assetService.updateAsset(assetId, updatedAsset);
            return ResponseEntity.ok(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


}