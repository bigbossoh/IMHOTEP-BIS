package com.bzdata.gestimospringbackend.user.controller;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.LocataireEncaisDTO;
import com.bzdata.gestimospringbackend.establishment.dto.response.EtablissementUtilisateurDto;
import com.bzdata.gestimospringbackend.user.dto.request.ChangePasswordRequestDto;
import com.bzdata.gestimospringbackend.user.dto.request.UserEstablishmentAssignmentRequestDto;
import com.bzdata.gestimospringbackend.user.dto.response.UtilisateurAfficheDto;
import com.bzdata.gestimospringbackend.user.dto.request.UtilisateurRequestDto;
import com.bzdata.gestimospringbackend.user.service.UtilisateurService;

import com.bzdata.gestimospringbackend.user.dto.response.ImportResultDto;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(APP_ROOT + "/utilisateur")
@RequiredArgsConstructor
 @Slf4j
@SecurityRequirement(name = "gestimoapi")
@CrossOrigin(origins="*")
public class UtilisateurController {
    private final UtilisateurService utilisateurService;

    @PostMapping("/save")
    public ResponseEntity<UtilisateurAfficheDto> saveUtilisateur(@RequestBody UtilisateurRequestDto request) {
         log.info("We are going to save a new locatire {}", request);
        return ResponseEntity.ok(utilisateurService.saveUtilisateur(request));
    }

    @GetMapping("/getutilisateurbyid/{id}")
    public ResponseEntity<UtilisateurRequestDto> getUtilisateurByID(@PathVariable("id") Long id) {
        // log.info("We are going to get back one utilisateur by ID {}", id);
        return ResponseEntity.ok(utilisateurService.findById(id));
    }

    @GetMapping("/getutilisateurbyemail/{email}")
    public ResponseEntity<UtilisateurRequestDto> getUtilisateurByEmail(@PathVariable("email") String email) {
        return ResponseEntity.ok(utilisateurService.findUtilisateurByEmail(email));
    }
    @GetMapping("/getutilisateurbyusername/{username}")
    public ResponseEntity<UtilisateurRequestDto> getUtilisateurByUsername(@PathVariable("username") String username) {
        return ResponseEntity.ok(utilisateurService.findUtilisateurByUsername(username));
    }
    @GetMapping("/getAllutilisateurbyAgence/{idAgence}")
    public ResponseEntity<List<UtilisateurAfficheDto>> getUtilisateurByAgence(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(utilisateurService.listOfAllUtilisateurLocataireOrderbyNameByAgence(idAgence));
    }
    //findUtilisateurByUsername
    @GetMapping("/all/{idAgence}")
    public ResponseEntity<List<UtilisateurAfficheDto>> getAllUtilisateursByOrder(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(utilisateurService.listOfAllUtilisateurOrderbyName(idAgence));
    }

    @GetMapping("/locataires/all/{idAgence}")
    public ResponseEntity<List<UtilisateurAfficheDto>> getAllLocatairesByOrder(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(utilisateurService.listOfAllUtilisateurLocataireOrderbyName(idAgence));
    }

    @GetMapping("/locataires/ayanbail/{idAgence}")
    public ResponseEntity<List<LocataireEncaisDTO>> getAllLocatairesAvecBail(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(utilisateurService.listOfLocataireAyantunbail(idAgence));
    }

    @GetMapping("/locataires/compte-client/{idAgence}")
    public ResponseEntity<List<LocataireEncaisDTO>> getAllLocatairesPourCompteClient(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(utilisateurService.listOfLocataireCompteClient(idAgence));
    }

    @GetMapping("/proprietaires/all/{idAgence}")
    public ResponseEntity<List<UtilisateurAfficheDto>> getAllProprietaireByOrder(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(utilisateurService.listOfAllUtilisateurProprietaireOrderbyName(idAgence));
    }

    @GetMapping("/gerants/all/{idAgence}")
    public ResponseEntity<List<UtilisateurAfficheDto>> getAllGerantsByOrder(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(utilisateurService.listOfAllUtilisateurGerantOrderbyName(idAgence));
    }

    @GetMapping("/superviseurs/all")
    public ResponseEntity<List<UtilisateurAfficheDto>> getAllSuperviseursByOrder() {
        return ResponseEntity.ok(utilisateurService.listOfAllUtilisateurSuperviseurOrderbyName());
    }
      @GetMapping("/clienthotel/all/{idAgence}")
    public ResponseEntity<List<UtilisateurAfficheDto>> listOfAllUtilisateurClientHotelOrderbyNameByAgence(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(utilisateurService.listOfAllUtilisateurClientHotelOrderbyNameByAgence(idAgence));
    }

    @PutMapping("/desactiver/{idUtilisateur}")
    public ResponseEntity<UtilisateurAfficheDto> desactiverUtilisateur(@PathVariable("idUtilisateur") Long idUtilisateur) {
        return ResponseEntity.ok(utilisateurService.desactiverUtilisateur(idUtilisateur));
    }

    @DeleteMapping("/{idUtilisateur}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable("idUtilisateur") Long idUtilisateur) {
        utilisateurService.deleteUtilisateur(idUtilisateur);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/change-password")
    public ResponseEntity<UtilisateurAfficheDto> changerMotDePasse(@RequestBody ChangePasswordRequestDto request) {
        return ResponseEntity.ok(utilisateurService.changerMotDePasse(request));
    }

    @PostMapping("/affecter-etablissement")
    public ResponseEntity<EtablissementUtilisateurDto> affecterUtilisateurAEtablissement(@RequestBody UserEstablishmentAssignmentRequestDto request) {
        return ResponseEntity.ok(utilisateurService.affecterUtilisateurAEtablissement(request));
    }

    @GetMapping("/etablissement/{idEtablissement}/users")
    public ResponseEntity<List<UtilisateurAfficheDto>> listerUtilisateursParEtablissement(@PathVariable("idEtablissement") Long idEtablissement) {
        return ResponseEntity.ok(utilisateurService.listerUtilisateursParEtablissement(idEtablissement));
    }

    @PostMapping(path = "/import/excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImportResultDto> importUtilisateursFromExcel(
            @RequestParam("file") MultipartFile file,
            @RequestParam("idAgence") Long idAgence,
            @RequestParam("idCreateur") Long idCreateur) {
        log.info("Import Excel utilisateurs - agence={}, createur={}, fichier={}", idAgence, idCreateur, file.getOriginalFilename());
        return ResponseEntity.ok(utilisateurService.importUtilisateursFromExcel(file, idAgence, idCreateur));
    }
}
