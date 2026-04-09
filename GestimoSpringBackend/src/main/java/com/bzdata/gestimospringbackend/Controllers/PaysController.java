package com.bzdata.gestimospringbackend.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.PaysDto;

import com.bzdata.gestimospringbackend.Services.PaysService;
@RestController
@RequestMapping(APP_ROOT + "/pays")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class PaysController {
    final PaysService paysService;
    //CREATION ET MODIFICATION D'UN PAYS
    @PostMapping("/save")
    @Operation(summary = "Creation et mise à jour d'un Pays", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PaysDto>savePays(@RequestBody PaysDto dto){
        log.info("We are going to save a new Pays {}", dto);
        return ResponseEntity.ok(paysService.save(dto)); 
    }
    //SUPPRESSION D'UN PAYS
    @Operation(summary = "Suppression d'un Pays avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean>deletePays(@PathVariable("id") Long id){
        log.info("We are going to save a new pays {}", id);
        return ResponseEntity.ok(paysService.delete(id));
    }
    // TOUT LES PAYS
    @Operation(summary = "Liste de tous les Pays", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all")
    public ResponseEntity<List<PaysDto>>findAllPays(){
        return ResponseEntity.ok(paysService.findAll());
    }
    //GET PAYS BY ID
    @Operation(summary = "Trouver un pays par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findById/{id}")
    public ResponseEntity<PaysDto> findPaysByID(@PathVariable("id") Long id) {
        log.info("Find by ID{}", id);
        return ResponseEntity.ok(paysService.findById(id));
    }

    // GET PAYS BY NAME
    @Operation(summary = "Trouver un pays par son nom", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByName/{name}")
    public ResponseEntity<PaysDto> findPaysByName(@PathVariable("name") String name) {
        log.info("Find Pays By nom {}", name);
        return ResponseEntity.ok(paysService.findByName(name));
    }
}
