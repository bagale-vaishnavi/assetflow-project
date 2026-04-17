package com.example.asset_management.config;

import com.example.asset_management.entity.User;
import com.example.asset_management.entity.*;
import com.example.asset_management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AssetCategoryRepository assetCategoryRepository;

    @Autowired
    private RequestStatusRepository requestStatusRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;   // This must be injected

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        createRoles();
        createDepartments();
        createAssetCategories();
        createRequestStatuses();
        createAdminUser();
        createSampleUsers();

        System.out.println("✅ DataInitializer completed!");
        System.out.println("   Admin → admin@company.com / admin123");
    }

    private void createRoles() {
        if (roleRepository.count() == 0) {
            List.of("ADMIN", "MANAGER", "EMPLOYEE").forEach(name -> {
                Role role = new Role();
                role.setRoleName(name);
                roleRepository.save(role);
            });
        }
    }

    private void createDepartments() {
        if (departmentRepository.count() == 0) {
            List.of("IT", "HR", "Finance").forEach(name -> {
                Department dept = new Department();
                dept.setName(name);
                departmentRepository.save(dept);
            });
        }
    }

    private void createAssetCategories() {
        if (assetCategoryRepository.count() == 0) {
            List.of("Electronics", "Furniture", "Software", "Networking").forEach(name -> {
                AssetCategory cat = new AssetCategory();
                cat.setCategoryName(name);
                assetCategoryRepository.save(cat);
            });
        }
    }

    private void createRequestStatuses() {
        if (requestStatusRepository.count() == 0) {
            List.of("Pending", "Approved", "Rejected", "In Progress", "Completed", "Cancelled")
                    .forEach(name -> {
                        RequestStatus status = new RequestStatus();
                        status.setStatusName(name);
                        requestStatusRepository.save(status);
                    });
        }
    }

    private void createAdminUser() {
        if (userRepository.findByEmail("admin@company.com").isEmpty()) {
            Role adminRole = roleRepository.findByRoleName("ADMIN").orElseThrow();

            User admin = new User();
            admin.setEmail("admin@company.com");
            admin.setName("System Administrator");
            admin.setPassword(passwordEncoder.encode("admin123"));   // ← Correct encoding
            admin.setRole(adminRole);

            userRepository.save(admin);
            System.out.println("Admin user created with properly encoded password");
        }
    }

    private void createSampleUsers() {
        // Manager
        if (userRepository.findByEmail("manager@company.com").isEmpty()) {
            Role managerRole = roleRepository.findByRoleName("MANAGER").orElseThrow();

            User manager = new User();
            manager.setEmail("manager@company.com");
            manager.setName("John Manager");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setRole(managerRole);
            userRepository.save(manager);

            // Link Employee
            Employee emp = new Employee();
            emp.setEmpName("John Manager");
            emp.setEmail("manager@company.com");
            emp.setUser(manager);
            employeeRepository.save(emp);
        }

        // Employee
        if (userRepository.findByEmail("employee@company.com").isEmpty()) {
            Role empRole = roleRepository.findByRoleName("EMPLOYEE").orElseThrow();

            User empUser = new User();
            empUser.setEmail("employee@company.com");
            empUser.setName("Alice Employee");
            empUser.setPassword(passwordEncoder.encode("employee123"));
            empUser.setRole(empRole);
            userRepository.save(empUser);

            Employee employee = new Employee();
            employee.setEmpName("Alice Employee");
            employee.setEmail("employee@company.com");
            employee.setUser(empUser);
            employeeRepository.save(employee);
        }
    }
}