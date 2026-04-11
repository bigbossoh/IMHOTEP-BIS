package com.bzdata.gestimospringbackend.user.controller;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.AUTHENTICATION_ENDPOINT;
import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.JWT_TOKEN_HEADER;
import static org.springframework.http.HttpStatus.OK;

import com.bzdata.gestimospringbackend.audit.dto.AuditLogRequestDto;
import com.bzdata.gestimospringbackend.audit.service.AuditLogService;
import com.bzdata.gestimospringbackend.user.dto.request.UtilisateurRequestDto;
import com.bzdata.gestimospringbackend.user.dto.request.AuthRequestDto;
import com.bzdata.gestimospringbackend.common.security.model.UserPrincipal;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.company.service.AgenceImmobilierService;
import com.bzdata.gestimospringbackend.user.service.UtilisateurService;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import com.bzdata.gestimospringbackend.common.security.provider.JWTTokenProvider;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.time.Instant;

@RestController
@RequestMapping(path = { AUTHENTICATION_ENDPOINT, "/" })
@RequiredArgsConstructor
@Slf4j
@SecurityRequirement(name = "gestimoapi")
@CrossOrigin("*")
public class AuthenticationController {

    private final AgenceImmobilierService AgenceImmobilierService;
    private final UtilisateurService utilisateurService;
    private final AuthenticationManager authenticationManager;
    private final JWTTokenProvider jwtTokenProvider;
    private final UtilisateurRepository utilisateurRepository;
    private final AuditLogService auditLogService;

    @PostMapping("/login")
    public ResponseEntity<Utilisateur> login(@RequestBody AuthRequestDto request) {
        long startTime = System.currentTimeMillis();
        log.info("Tentative de connexion pour l'email: {}", request.getEmail());
        authenticate(request.getEmail(), request.getPassword());
        UtilisateurRequestDto utilisateurByEmail = utilisateurService
                .findUtilisateurByEmail(request.getEmail());
        log.info("Utilisateur trouvé avec l'id: {}", utilisateurByEmail.getId());
        Utilisateur loginUser = utilisateurRepository.findById(utilisateurByEmail.getId()).orElseThrow(
                () -> new InvalidEntityException(
                        "Aucun Utilisateur has been found with Code " + utilisateurByEmail.getId(),
                        ErrorCodes.UTILISATEUR_NOT_FOUND));
        UserPrincipal userPrincipal = new UserPrincipal(loginUser);
        log.info("Connexion réussie pour: {}", loginUser.getEmail());
        HttpHeaders jwtHeader = getJwtHeader(userPrincipal);
        saveLoginAudit(loginUser, System.currentTimeMillis() - startTime);

        return new ResponseEntity<>(loginUser, jwtHeader, OK);
    }

    private void authenticate(String email, String password) {
        log.info("Authentification en cours pour l'email: {}", email);
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }

    private HttpHeaders getJwtHeader(UserPrincipal userPrincipal) {
        log.info("depuis la fonction getJwtHeader {}", userPrincipal.toString());
        HttpHeaders headers = new HttpHeaders();
        headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJwtToken(userPrincipal));
        return headers;
    }

    private void saveLoginAudit(Utilisateur loginUser, long durationMs) {
        try {
            AuditLogRequestDto audit = new AuditLogRequestDto();
            audit.setIdAgence(loginUser.getIdAgence());
            audit.setTimestamp(Instant.now().toString());
            audit.setUserId(loginUser.getId());
            audit.setUserName(buildDisplayName(loginUser));
            audit.setMethod("POST");
            audit.setUrl("/api/v1/auth/login");
            audit.setAction("Connexion");
            audit.setModule("Authentification");
            audit.setStatus(OK.value());
            audit.setSuccess(Boolean.TRUE);
            audit.setDurationMs(durationMs);
            auditLogService.save(audit);
        } catch (Exception exception) {
            log.warn("Impossible d'enregistrer l'audit de connexion pour l'utilisateur {}", loginUser.getEmail(), exception);
        }
    }

    private String buildDisplayName(Utilisateur utilisateur) {
        String prenom = utilisateur.getPrenom() != null ? utilisateur.getPrenom().trim() : "";
        String nom = utilisateur.getNom() != null ? utilisateur.getNom().trim() : "";
        String fullName = (prenom + " " + nom).trim();
        if (!fullName.isEmpty()) {
            return fullName;
        }
        if (utilisateur.getUsername() != null && !utilisateur.getUsername().isBlank()) {
            return utilisateur.getUsername();
        }
        return "Inconnu";
    }

    @GetMapping("accountVerification/{token}")
    public ResponseEntity<String> verifyAccount(@PathVariable String token) {
        AgenceImmobilierService.verifyAccount(token);
        return new ResponseEntity<>("Le compte est activé avec succès", OK);
    }

}
