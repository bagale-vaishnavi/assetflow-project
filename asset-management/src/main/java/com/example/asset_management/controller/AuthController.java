package com.example.asset_management.controller;

import com.example.asset_management.dto.AuthRequest;
import com.example.asset_management.dto.AuthResponse;
import com.example.asset_management.entity.User;
import com.example.asset_management.repository.RoleRepository;
import com.example.asset_management.repository.UserRepository;
import com.example.asset_management.security.JwtUtil;
import com.example.asset_management.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ===================== LOGIN =====================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        try {
            var authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getName(),
                    user.getRole().getRoleName(),
                    user.getUserId()
            ));

        } catch (Exception e) {
            System.out.println("Login failed for: " + request.getEmail());
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ===================== REGISTER =====================
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        String roleName = (request.getRole() != null && !request.getRole().isEmpty())
                ? request.getRole().toUpperCase() : "EMPLOYEE";

        var role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName() != null ? request.getName() : request.getEmail().split("@")[0]);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        userRepository.save(user);

        return ResponseEntity.ok("Account created successfully! You can now login.");
    }
}