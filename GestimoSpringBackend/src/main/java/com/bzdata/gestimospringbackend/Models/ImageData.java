package com.bzdata.gestimospringbackend.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ImageData")
@EqualsAndHashCode(callSuper=false)
@Data
@AllArgsConstructor
@NoArgsConstructor

public class ImageData extends AbstractEntity{

    private String nameImage;
    private String typeImage;
    private String profileAgenceImageUrl;
    @Lob  
    private byte[] imageData;
     @ManyToOne
     private Bienimmobilier bienimmobilier;

}