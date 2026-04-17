package com.example.asset_management.repository;


import com.example.asset_management.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

//import javax.management.relation.Role;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(String roleName);
}