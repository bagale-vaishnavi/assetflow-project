package com.example.asset_management.repository;

import com.example.asset_management.entity.AssetAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, Long> {
}