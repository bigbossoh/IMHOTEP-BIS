package com.bzdata.gestimospringbackend.Services;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.bzdata.gestimospringbackend.DTOs.ImageDataDto;

public interface ImageDataService {
    boolean saveImageAppartement(Long idBien, String fileName,MultipartFile imageData)throws IOException;
    List    <ImageDataDto> loadImageFromBien(Long idBien);
}
