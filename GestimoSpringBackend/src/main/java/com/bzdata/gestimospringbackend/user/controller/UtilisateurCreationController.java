package com.bzdata.gestimospringbackend.user.controller;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.user.dto.response.UtilisateurAfficheDto;
import com.bzdata.gestimospringbackend.user.dto.request.UtilisateurRequestDto;
import com.bzdata.gestimospringbackend.user.service.UtilisateurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(APP_ROOT + "/utilisateurs")
@RequiredArgsConstructor
@Slf4j
@SecurityRequirement(name = "gestimoapi")
@CrossOrigin(origins = "*")
public class UtilisateurCreationController {

  private final UtilisateurService utilisateurService;

  @PostMapping("/create")
  @Operation(summary = "Creer un nouvel utilisateur", security = @SecurityRequirement(name = "gestimoapi"))
  public ResponseEntity<UtilisateurAfficheDto> createUtilisateur(
    @RequestBody UtilisateurRequestDto request
  ) {
    request.setId(0L);
    log.info("Creation d'un nouvel utilisateur {}", request.getMobile());
    UtilisateurAfficheDto utilisateurCree = utilisateurService.saveUtilisateur(
      request
    );
    return ResponseEntity.status(HttpStatus.CREATED).body(utilisateurCree);
  }
}
