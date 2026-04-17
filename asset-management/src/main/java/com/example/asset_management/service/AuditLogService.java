package com.example.asset_management.service;


import com.example.asset_management.entity.AuditLog;
import com.example.asset_management.entity.User;
import com.example.asset_management.repository.AuditLogRepository;
import com.example.asset_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    public void logAction(Long userId, String action) {
        AuditLog log = new AuditLog();
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            log.setUser(user);
        }
        log.setAction(action);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByLogTimeDesc();
    }
}