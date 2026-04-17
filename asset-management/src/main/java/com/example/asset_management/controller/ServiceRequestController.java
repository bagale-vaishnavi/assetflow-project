package com.example.asset_management.controller;

import com.example.asset_management.entity.ServiceRequest;
import com.example.asset_management.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    // Employee: Create new service request
    @PostMapping
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'ADMIN')")
    public ResponseEntity<ServiceRequest> createRequest(@RequestBody ServiceRequest request) {
        // Get current logged-in user ID from JWT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = ((com.example.asset_management.security.UserDetailsImpl) auth.getPrincipal()).getUserId();

        ServiceRequest saved = serviceRequestService.createRequest(request, userId);
        return ResponseEntity.ok(saved);
    }

    // Employee: View my own requests
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'ADMIN')")
    public ResponseEntity<List<ServiceRequest>> getMyRequests() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = ((com.example.asset_management.security.UserDetailsImpl) auth.getPrincipal()).getUserId();

        return ResponseEntity.ok(serviceRequestService.getMyRequests(userId));
    }

    // Manager + Admin: View all requests
    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<ServiceRequest>> getAllRequests() {
        return ResponseEntity.ok(serviceRequestService.getAllRequests());
    }

    // Manager + Admin: View pending requests
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<ServiceRequest>> getPendingRequests() {
        return ResponseEntity.ok(serviceRequestService.getPendingRequests());
    }

    // Manager: Approve or Reject request
    @PutMapping("/{requestId}/approve")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<String> approveRequest(
            @PathVariable Long requestId,
            @RequestParam String decision) {   // APPROVED or REJECTED

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long managerId = ((com.example.asset_management.security.UserDetailsImpl) auth.getPrincipal()).getUserId();

        // You can also call ApprovalService.approveRequest here if you want separate approval record
        serviceRequestService.updateRequestStatus(requestId, decision.equalsIgnoreCase("APPROVED") ? "Approved" : "Rejected", managerId);

        return ResponseEntity.ok("Request " + decision + " successfully");
    }

    // Employee: Cancel own request
    @PutMapping("/{requestId}/cancel")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'ADMIN')")
    public ResponseEntity<String> cancelRequest(@PathVariable Long requestId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = ((com.example.asset_management.security.UserDetailsImpl) auth.getPrincipal()).getUserId();

        serviceRequestService.cancelRequest(requestId, userId);
        return ResponseEntity.ok("Request cancelled successfully");
    }

}