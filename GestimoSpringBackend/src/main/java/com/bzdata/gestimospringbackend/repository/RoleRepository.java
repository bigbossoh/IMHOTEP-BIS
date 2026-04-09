package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {

    @Override
    Optional<Role> findById(Long aLong);
    Optional<Role>findRoleByRoleName(String roleName);
}
