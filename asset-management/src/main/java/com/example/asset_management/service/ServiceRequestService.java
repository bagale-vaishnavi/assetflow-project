package com.example.asset_management.service;

import com.example.asset_management.entity.ServiceRequest;
import com.example.asset_management.entity.RequestStatus;
import com.example.asset_management.entity.User;
import com.example.asset_management.repository.RequestStatusRepository;
import com.example.asset_management.repository.ServiceRequestRepository;
import com.example.asset_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository requestRepository;

    @Autowired
    private RequestStatusRepository statusRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private NotificationService notificationService;

    public ServiceRequest createRequest(ServiceRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RequestStatus pendingStatus = statusRepository.findByStatusName("Pending")
                .orElseThrow(() -> new RuntimeException("Pending status not found"));

        request.setUser(user);
        request.setStatus(pendingStatus);

        ServiceRequest saved = requestRepository.save(request);

        auditLogService.logAction(userId, "Service Request Created: " + request.getTitle());

        // Notify Managers
        notificationService.notifyManagers("New Service Request: " + request.getTitle());

        return saved;
    }

    public List<ServiceRequest> getMyRequests(Long userId) {
        return requestRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    }

    public List<ServiceRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<ServiceRequest> getPendingRequests() {
        return requestRepository.findPendingRequests();
    }

    @Transactional
    public ServiceRequest updateRequestStatus(Long requestId, String newStatusName, Long managerId) {
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        RequestStatus newStatus = statusRepository.findByStatusName(newStatusName)
                .orElseThrow(() -> new RuntimeException("Status not found: " + newStatusName));

        request.setStatus(newStatus);
        ServiceRequest updated = requestRepository.save(request);

        auditLogService.logAction(managerId, "Request Status Changed: " + request.getTitle() + " → " + newStatusName);

        // Notify the employee
        notificationService.sendNotification(request.getUser().getUserId(),
                "Your request '" + request.getTitle() + "' status updated to " + newStatusName);

        return updated;
    }


    public void cancelRequest(Long requestId, Long userId) {
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("You can only cancel your own requests");
        }

        RequestStatus cancelled = statusRepository.findByStatusName("Cancelled")
                .orElseThrow(() -> new RuntimeException("Cancelled status not found"));

        request.setStatus(cancelled);
        requestRepository.save(request);

        auditLogService.logAction(userId, "Request Cancelled: " + request.getTitle());
    }

}