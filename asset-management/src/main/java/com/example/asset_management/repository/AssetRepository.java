package com.example.asset_management.repository;

import com.example.asset_management.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    List<Asset> findByStatus(String status);

    List<Asset> findByDepartmentId(Long departmentId);

    @Query("SELECT a FROM Asset a WHERE a.status = :status AND a.department.id = :deptId")
    List<Asset> findByStatusAndDepartmentId(@Param("status") String status, @Param("deptId") Long deptId);
}