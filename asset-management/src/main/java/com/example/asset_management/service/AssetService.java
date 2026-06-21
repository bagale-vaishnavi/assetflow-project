package com.example.asset_management.service;

import com.example.asset_management.entity.Asset;
import com.example.asset_management.entity.AssetAssignment;
import com.example.asset_management.entity.User;
import com.example.asset_management.repository.AssetAssignmentRepository;
import com.example.asset_management.repository.AssetRepository;
import com.example.asset_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AssetService {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssetAssignmentRepository assignmentRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private NotificationService notificationService;

    public Asset addAsset(Asset asset) {
        Asset saved = assetRepository.save(asset);
        auditLogService.logAction(null, "New Asset Added: " + asset.getAssetName());
        return saved;
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public List<Asset> getAvailableAssets() {
        return assetRepository.findByStatus("Available");
    }

    @Transactional
    public void assignAsset(Long assetId, Long userId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        if (!"Available".equals(asset.getStatus())) {
            throw new RuntimeException("Asset is not available");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AssetAssignment assignment = new AssetAssignment();
        assignment.setAsset(asset);
        assignment.setUser(user);
        assignment.setAssignDate(LocalDateTime.now());

        assignmentRepository.save(assignment);

        asset.setStatus("Assigned");
        assetRepository.save(asset);

        auditLogService.logAction(asset.getAssetId(), "Asset assigned to user: " + user.getName());
    }

    public void updateAssetStatus(Long assetId, String status) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        asset.setStatus(status);
        assetRepository.save(asset);
        auditLogService.logAction(null, "Asset Status Updated: " + asset.getAssetName() + " -> " + status);
    }
    public void deleteAsset(Long assetId) {

        boolean assigned = assignmentRepository.existsByAssetAssetId(assetId);

        if (assigned) {
            throw new RuntimeException(
                    "Cannot delete asset because it is assigned to an employee");
        }

        assetRepository.deleteById(assetId);
    }

    @Transactional
    public Asset updateAsset(Long assetId, Asset updatedAsset) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        asset.setAssetName(updatedAsset.getAssetName());
        asset.setAssetTag(updatedAsset.getAssetTag());
        asset.setQuantity(updatedAsset.getQuantity());
        asset.setStatus(updatedAsset.getStatus());
        asset.setPurchaseDate(updatedAsset.getPurchaseDate());
        asset.setAssetType(updatedAsset.getAssetType());


        return assetRepository.save(asset);
    }
}