package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.AppelLoyersFactureDto;
import com.bzdata.gestimospringbackend.DTOs.BailClotureRequestDto;
import com.bzdata.gestimospringbackend.DTOs.BailModifDto;
import com.bzdata.gestimospringbackend.DTOs.LocataireEncaisDTO;
import com.bzdata.gestimospringbackend.DTOs.OperationDto;
import com.bzdata.gestimospringbackend.Services.BailService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping(APP_ROOT + "/bail")
@RequiredArgsConstructor
// @Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class BailController {

    final BailService bailService;

    @Operation(summary = "Cloture du bail par rapport a son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/clotureBail/{id}")
    public ResponseEntity<List<OperationDto>> clotureBail(
            @PathVariable("id") Long id,
            @RequestParam(name = "compteSolde", required = false) Boolean compteSolde,
            @RequestBody(required = false) BailClotureRequestDto requestDto) {
        // log.info("cloture du bail by ID Bail {}", id);
        return ResponseEntity.ok(bailService.closeBail(id, compteSolde, requestDto));
    }

    @Operation(summary = "nombre de bail actif", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/nombrebailactif/{idAgence}")
    public ResponseEntity<Integer> nombrebailactif(@PathVariable("idAgence") Long idAgence) {
        // log.info("nombre de baux actifs");
        return ResponseEntity.ok(bailService.nombreBauxActifs(idAgence));
    }

    @Operation(summary = "nombre de bail non actif", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/nombrebailnonactif/{idAgence}")
    public ResponseEntity<Integer> nombrebailnonactif(@PathVariable("idAgence") Long idAgence) {
        // log.info("nombre de baux non actifs");
        return ResponseEntity.ok(bailService.nombreBauxNonActifs(idAgence));
    }

    @Operation(summary = "All Bail By BienImmobilier", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/getallbailbybien/{id}")
    public ResponseEntity<List<AppelLoyersFactureDto>> listDesBauxPourUnBienImmobilier(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bailService.findAllByIdBienImmobilier(id));
    }

    @Operation(summary = "All Bail By BienImmobilier", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/getallbailbylocataire/{id}")
    public ResponseEntity<List<OperationDto>> listDesBauxPourUnLocataire(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bailService.findAllByIdLocataire(id));
    }

    @Operation(summary = "All Bail By BienImmobilier", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findoperationbyid/{id}")
    public ResponseEntity<OperationDto> findOperationById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bailService.findOperationById(id));
    }

    @GetMapping("/bailLocataireetbien/{locataire}/{bien}")
    public ResponseEntity<LocataireEncaisDTO> bailByLocataireEtBien(@PathVariable("locataire") Long locataire,
            @PathVariable("bien") Long bien) {
        // log.info("Input des locataire est le suivant ::: {}, {}", locataire, bien);
        return ResponseEntity.ok(bailService.bailBayLocataireEtBien(locataire, bien));
    }

    @Operation(summary = "Cloture du bail par rapport a son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/supprimerBail/{id}")
    public ResponseEntity<Boolean> supprimerBail(@PathVariable("id") Long id) {
        // log.info("cloture du bail by ID Bail {}", id);
        return ResponseEntity.ok(bailService.deleteOperationById(id));
    }

    @PostMapping("/save")
    @Operation(summary = "Creation et mise à jour d'un Bail Appartement", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<OperationDto> modifierUnBail(@RequestBody BailModifDto dto) {
        // log.info("We are going to save a new Bail Appartement {}", dto);
        return ResponseEntity.ok(bailService.modifierUnBail(dto));
    }
}
