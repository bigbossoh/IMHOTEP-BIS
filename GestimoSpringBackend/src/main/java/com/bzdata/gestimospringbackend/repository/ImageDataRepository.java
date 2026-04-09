package com.bzdata.gestimospringbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bzdata.gestimospringbackend.Models.ImageData;

public interface ImageDataRepository extends JpaRepository<ImageData,Long>{
    
}
