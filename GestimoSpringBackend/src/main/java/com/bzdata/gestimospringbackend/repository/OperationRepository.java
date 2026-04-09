package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.Operation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OperationRepository extends JpaRepository<Operation, Long> {

}
