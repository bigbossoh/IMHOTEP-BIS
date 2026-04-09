package com.bzdata.gestimospringbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bzdata.gestimospringbackend.Models.ClotureCaisse;

public interface ClotureCaisseRepository extends JpaRepository<ClotureCaisse,Long>{
    int countByIdCreateur(Long id);
}
