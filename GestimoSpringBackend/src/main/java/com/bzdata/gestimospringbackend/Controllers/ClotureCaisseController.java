package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.DTOs.ClotureCaisseDto;
import com.bzdata.gestimospringbackend.Services.ClotureCaisseService;

import java.time.Instant;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(APP_ROOT + "/cloturecaisse")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClotureCaisseController {

  final ClotureCaisseService clotureCaisseService;

  @PostMapping("/savecloturecaisse")
  public ResponseEntity<Boolean> saveClotureCaisse(
    @RequestBody ClotureCaisseDto dto
  ) {
    
    return ResponseEntity.ok(clotureCaisseService.saveClotureCaisse(dto));
  }

  @GetMapping("/countInitClotureByCaissiaireAndChampitre/{idCaisse}/{chapitre}")
  public ResponseEntity<Integer> countInitClotureByCaissiaireAndChampitre(
    @PathVariable("idCaisse") Long idCaisse,
    @PathVariable("chapitre") String chapitre
  ) {
    return ResponseEntity.ok(
      clotureCaisseService.countInitClotureByCaissiaireAndChampitre(
        idCaisse,
        chapitre
      )
    );
  }

  @PostMapping(
    "/countInitClotureByCaissiaireAndChampitre/{idCaisse}/{chapitre}"
  )
  public ResponseEntity<List<ClotureCaisseDto>> findAllByCaissierAndChapitre(
    @PathVariable("idCaisse") Long idCaisse,
    @PathVariable("chapitre") String chapitre
  ) {
    return ResponseEntity.ok(
      clotureCaisseService.findAllByCaissierAndChapitre(idCaisse, chapitre)
    );
  }
  @GetMapping(
    "/findAllCloturerCaisseByDateAndChapitre/{idCaisse}/{chapitre}/{dateDuJoure}"
  )
  public ResponseEntity<List<ClotureCaisseDto>> findAllCloturerCaisseByDateAndChapitre(
     @PathVariable("dateDuJoure") Instant dateDuJoure,
    @PathVariable("idCaisse") Long idCaisse,
    @PathVariable("chapitre") String chapitre
  ) {
    return ResponseEntity.ok(
      clotureCaisseService.findAllCloturerCaisseByDateAndChapitre(dateDuJoure,idCaisse, chapitre)
    );
  }

   @GetMapping(
    "/findAllCloturerCaisseAgence"
  )
  public ResponseEntity<List<ClotureCaisseDto>> findAllCloturerCaisseAgence(
  ) {
    return ResponseEntity.ok(
      clotureCaisseService.findAllCloturerCaisseAgence()
    );
  }
  
   @GetMapping(
    "/findNonCloturerByDateAndCaisseAndChapitre/{idCaisse}/{chapitre}/{dateDuJoure}"
  )
  public ResponseEntity<List<ClotureCaisseDto>>  findNonCloturerByDateAndCaisseAndChapitre(
       @PathVariable("dateDuJoure") Instant dateDuJoure,
    @PathVariable("idCaisse") Long idCaisse,
    @PathVariable("chapitre") String chapitre
  ){
       return ResponseEntity.ok(
      clotureCaisseService.findNonCloturerByDateAndCaisseAndChapitre(dateDuJoure,idCaisse, chapitre)
    );
  }
}
