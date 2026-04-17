package com.example.asset_management.repository;

import com.example.asset_management.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApprovalRepository extends JpaRepository<Approval, Long> {

    Optional<Approval> findByRequestRequestId(Long requestId);

    List<Approval> findByApprovedByUserId(Long userId);
}