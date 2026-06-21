package com.example.asset_management.service;


import com.example.asset_management.entity.Approval;
import com.example.asset_management.entity.ServiceRequest;
import com.example.asset_management.entity.User;
import com.example.asset_management.repository.ApprovalRepository;
import com.example.asset_management.repository.ServiceRequestRepository;
import com.example.asset_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApprovalService {

    @Autowired
    private ApprovalRepository approvalRepository;

    @Autowired
    private ServiceRequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRequestService requestService;

    @Transactional
    public Approval approveRequest(Long requestId, Long managerId, String decision) {
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        Approval approval = new Approval();
        approval.setRequest(request);
        approval.setApprovedBy(manager);
        approval.setApprovalStatus(decision.toUpperCase()); // APPROVED or REJECTED

        Approval savedApproval = approvalRepository.save(approval);

        // Update request status
        String newStatus = decision.equalsIgnoreCase("APPROVED") ? "Approved" : "Rejected";
        requestService.updateRequestStatus(requestId, newStatus, managerId);

        return savedApproval;
    }
}