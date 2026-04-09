package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.DTOs.CategoryChambreSaveOrUpdateDto;
import com.bzdata.gestimospringbackend.Services.CategoryChambreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(APP_ROOT + "/categoriechambre")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class CategorieChambreController {

  final CategoryChambreService categoryChambreService;

  @PostMapping("/saveorupdate")
  @Operation(
    summary = "Creation et mise à jour d'une Categorie de Chambre",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  public ResponseEntity<CategoryChambreSaveOrUpdateDto> saveorupdateCategoryChambre(
    @RequestBody CategoryChambreSaveOrUpdateDto dto
  ) {
    log.info("We are going to save a new Commune {}", dto);
    return ResponseEntity.ok(categoryChambreService.saveOrUpdate(dto));
  }

  // SUPPRESSION D'UNE COMMUNE
  @Operation(
    summary = "Suppression d'une Categorie Chambre avec l'ID en paramètre",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @DeleteMapping("/delete/{id}")
  public ResponseEntity<Void> deleteCategoryChambre(
    @PathVariable("id") Long id
  ) {
    log.info("We are going to delete a Ville {}", id);
    categoryChambreService.delete(id);
    return ResponseEntity.ok().build();
  }

  @Operation(
    summary = "Trouver une CateroryChambre par son ID",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @GetMapping("/findById/{id}")
  public ResponseEntity<CategoryChambreSaveOrUpdateDto> findCategorieChambreByID(
    @PathVariable("id") Long id
  ) {
    log.info("Find Commune by ID{}", id);
    return ResponseEntity.ok(categoryChambreService.findById(id));
  }

  @Operation(
    summary = "Save or Up une CateroryChambre par son ID",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @PostMapping("/saveOrUpdateCategoryChambre")
  public ResponseEntity<CategoryChambreSaveOrUpdateDto> saveOrUpdateCategoryChambre(
    @RequestBody CategoryChambreSaveOrUpdateDto dto
  ) {
    log.info("The save Catégorie Chambre : : : {}", dto);
    return ResponseEntity.ok(
      categoryChambreService.saveOrUpdateCategoryChambre(dto)
    );
  }

  @Operation(
    summary = "Liste de toutes les Communes",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @GetMapping("/all/{idAgence}")
  public ResponseEntity<List<CategoryChambreSaveOrUpdateDto>> findAllCategorieChambre(@PathVariable("idAgence")Long idAgence) {
    return ResponseEntity.ok(categoryChambreService.findAllCategorie(idAgence));
  }
   @Operation(
    summary = "Liste de toutes les Communes",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @GetMapping("/findCategorieByIdAppartement/{idAppart}")
  public ResponseEntity<CategoryChambreSaveOrUpdateDto> findCategorieByIdAppartement(@PathVariable("idAppart")Long idAppart) {
    return ResponseEntity.ok(categoryChambreService.findCategorieByIdAppartement(idAppart));
  }
}
