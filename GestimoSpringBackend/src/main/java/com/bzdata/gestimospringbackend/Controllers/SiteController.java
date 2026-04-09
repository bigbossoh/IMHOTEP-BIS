package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;
import java.util.List;
import com.bzdata.gestimospringbackend.DTOs.SiteRequestDto;
import com.bzdata.gestimospringbackend.DTOs.SiteResponseDto;
import com.bzdata.gestimospringbackend.Services.SiteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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

@RestController
@RequestMapping(APP_ROOT + "/sites")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
@CrossOrigin(origins="*")
public class SiteController {
    final SiteService siteService;

    // CREATION ET MODIFICATION D'UN SITE
    @PostMapping("/save")
    @Operation(summary = "Creation et mise à jour d'un Site", security = @SecurityRequirement(name = "bearerAuth"))

    public ResponseEntity<Boolean> saveSites(@RequestBody SiteRequestDto dto) {

        log.info("We are going to save a new Site {}", dto);
        return ResponseEntity.ok(siteService.save(dto));
    }
    @PostMapping("/savesite")
    @Operation(summary = "Creation et mise à jour d'un Site", security = @SecurityRequirement(name = "bearerAuth"))

    public ResponseEntity<SiteResponseDto> saveSite(@RequestBody SiteRequestDto dto) {

        log.info("We are going to save a new Site {}", dto);
        return ResponseEntity.ok(siteService.saveSite(dto));
    }
    // SUPPRESSION D'UN SITE
    @Operation(summary = "Suppression d'un Site avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteSite(@PathVariable("id") Long id) {
        log.info("We are going to delete a Site with ID {}", id);
        return ResponseEntity.ok(siteService.delete(id));
    }

    // TOUT LES SITE
    @Operation(summary = "Liste de tous les Sites", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all/{idAgence}")
    public ResponseEntity<List<SiteResponseDto>> findAllSites(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(siteService.findAll(idAgence));
    }

    // GET Site BY ID
    @Operation(summary = "Trouver un site par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findById/{id}")
    public ResponseEntity<SiteResponseDto> findSiteByID(@PathVariable("id") Long id) {
        log.info("Find site by ID{}", id);
        return ResponseEntity.ok(siteService.findById(id));
    }

    // GET SITE BY ID
    @Operation(summary = "Trouver un Site par son nom", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByName/{name}")
    public ResponseEntity<SiteResponseDto> findSiteByName(@PathVariable("name") String name) {
        log.info("Find Site By nom {}", name);
        return ResponseEntity.ok(siteService.findByName(name));
    }
}
