package com.example.asset_management.repository;

import com.example.asset_management.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByUserUserId(Long userId);

    List<ServiceRequest> findByStatusStatusId(Integer statusId);

    @Query("SELECT sr FROM ServiceRequest sr WHERE sr.user.userId = :userId ORDER BY sr.createdAt DESC")
    List<ServiceRequest> findByUserUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    // For Manager - pending requests
    @Query("SELECT sr FROM ServiceRequest sr WHERE sr.status.statusName = 'Pending'")
    List<ServiceRequest> findPendingRequests();
}