package com.example.asset_management.service;


import com.example.asset_management.dto.AuthRequest;
import com.example.asset_management.entity.Role;
import com.example.asset_management.entity.User;
import com.example.asset_management.repository.RoleRepository;
import com.example.asset_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//import javax.management.relation.Role;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditLogService auditLogService;

    public User registerUser(AuthRequest request, String roleName) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getEmail().split("@")[0]); // temporary name
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);
        auditLogService.logAction(savedUser.getUserId(), "User Registered: " + roleName);
        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        // Do not update password here unless explicitly handled

        User saved = userRepository.save(user);
        auditLogService.logAction(user.getUserId(), "User Updated: " + user.getName());
        return saved;
    }
}