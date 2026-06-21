package com.example.asset_management.repository;

import com.example.asset_management.entity.Asset;
import com.example.asset_management.entity.AssetAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, Long> {
    List<AssetAssignment> findByAsset(Asset asset);

    boolean existsByAssetAssetId(Long assetId);

}
