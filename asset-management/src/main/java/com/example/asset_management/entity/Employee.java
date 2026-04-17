package com.example.asset_management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long empId;

    @Column(nullable = false)
    private String empName;

    @Email
    private String email;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}