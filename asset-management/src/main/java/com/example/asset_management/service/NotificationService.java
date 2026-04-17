package com.example.asset_management.service;
import com.example.asset_management.entity.Notification;
import com.example.asset_management.entity.User;
import com.example.asset_management.repository.NotificationRepository;
import com.example.asset_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public void sendNotification(Long userId, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    public void notifyManagers(String message) {
        // In real project, fetch all MANAGER + ADMIN users
        // For simplicity, you can call sendNotification for each
        // Or implement later with proper role query
        System.out.println("Manager Notification: " + message); // placeholder
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserUserIdAndIsReadFalse(userId);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow();
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}