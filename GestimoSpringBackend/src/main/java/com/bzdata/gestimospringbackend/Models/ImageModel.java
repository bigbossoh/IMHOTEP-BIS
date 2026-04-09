package com.bzdata.gestimospringbackend.Models;

import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "image_table")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ImageModel extends AbstractEntity{

    // public ImageModel() {
    //     super();
    // }

    // public ImageModel(String name, String type, byte[] picByte) {
    //     this.name = name;
    //     this.type = type;
    //     this.picByte = picByte;
    // }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;
    @ManyToOne
    AgenceImmobiliere logoAgence;
    @Lob
    @Column(name = "picByte", columnDefinition = "LONGBLOB")
    private byte[] picByte;

 
}
