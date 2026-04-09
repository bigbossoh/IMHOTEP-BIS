package com.bzdata.gestimospringbackend.Services.Impl;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bzdata.gestimospringbackend.DTOs.ImageDataDto;
import com.bzdata.gestimospringbackend.Models.Bienimmobilier;
import com.bzdata.gestimospringbackend.Models.ImageData;
import com.bzdata.gestimospringbackend.Services.ImageDataService;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.BienImmobilierRepository;
import com.bzdata.gestimospringbackend.repository.ImageDataRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImageDataServiceImpl implements ImageDataService{
final ImageDataRepository imageDataRepository;
final BienImmobilierRepository bienImmobilierRepository;
final GestimoWebMapperImpl gestimoWebMapperImpl;
    @Override
    public boolean saveImageAppartement(Long idBien, String fileName, MultipartFile imageData) throws IOException{
       log.info("THE DATA UN BACKEND IS  {} : {} : {}", fileName, fileName, imageData);
        Bienimmobilier bienimmobilier=bienImmobilierRepository.findById(idBien).orElse(null);
        if (bienimmobilier==null){
            return false;
        }

        ImageData imagData = new ImageData();
        imagData.setBienimmobilier(bienimmobilier);
        imagData.setNameImage(fileName);
        imagData.setImageData(imageData.getBytes());
        imagData.setTypeImage(imageData.getContentType());
        imageDataRepository.save(imagData);        
        return true;
    }
    @Override
    public List<ImageDataDto> loadImageFromBien(Long idBien) {
      return imageDataRepository.findAll().stream().filter(bien->bien.getBienimmobilier().getId()==idBien)
      .map(gestimoWebMapperImpl::fromImageData)
      .collect(Collectors.toList());
      
    }
    
}
