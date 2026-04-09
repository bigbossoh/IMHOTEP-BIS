package com.bzdata.gestimospringbackend.user.controller;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.user.dto.request.PasswordResetConfirmationRequestDto;
import com.bzdata.gestimospringbackend.user.dto.request.PasswordResetRequestDto;
import com.bzdata.gestimospringbackend.user.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(APP_ROOT + "/utilisateur/password-reset")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PasswordResetController {

  private final UtilisateurService utilisateurService;

  @PostMapping("/request")
  public ResponseEntity<String> demanderReinitialisation(
    @RequestBody PasswordResetRequestDto request
  ) {
    utilisateurService.demanderReinitialisationMotDePasse(request);
    return ResponseEntity.ok(
      "Si un compte correspond a cet identifiant, un email de reinitialisation a ete envoye."
    );
  }

  @PostMapping("/confirm")
  public ResponseEntity<String> confirmerReinitialisation(
    @RequestBody PasswordResetConfirmationRequestDto request
  ) {
    utilisateurService.reinitialiserMotDePasse(request);
    return ResponseEntity.ok("Le mot de passe a ete reinitialise avec succes.");
  }
}
