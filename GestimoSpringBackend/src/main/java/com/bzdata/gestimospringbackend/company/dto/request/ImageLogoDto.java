package com.bzdata.gestimospringbackend.company.dto.request;

import org.springframework.web.multipart.MultipartFile;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImageLogoDto {
    Long idImage;
    private String nameImage;
    private String typeImage;
    private String profileAgenceImageUrl;

    private byte[] imageData;
    MultipartFile file;
    private Long agenceImmobiliere;
}
