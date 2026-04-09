package com.bzdata.gestimospringbackend.user.service;

import com.bzdata.gestimospringbackend.DTOs.LocataireEncaisDTO;
import com.bzdata.gestimospringbackend.establishment.dto.response.EtablissementUtilisateurDto;
import com.bzdata.gestimospringbackend.user.dto.request.ChangePasswordRequestDto;
import com.bzdata.gestimospringbackend.user.dto.request.PasswordResetConfirmationRequestDto;
import com.bzdata.gestimospringbackend.user.dto.request.PasswordResetRequestDto;
import com.bzdata.gestimospringbackend.user.dto.request.UserEstablishmentAssignmentRequestDto;
import com.bzdata.gestimospringbackend.user.dto.response.UtilisateurAfficheDto;
import com.bzdata.gestimospringbackend.user.dto.request.UtilisateurRequestDto;
import com.bzdata.gestimospringbackend.common.security.entity.VerificationToken;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import com.bzdata.gestimospringbackend.user.dto.response.ImportResultDto;

public interface UtilisateurService {

    UtilisateurAfficheDto saveUtilisateur(UtilisateurRequestDto dto);

    UtilisateurRequestDto findById(Long id);

    UtilisateurRequestDto findUtilisateurByEmail(String email);

    UtilisateurRequestDto findUtilisateurByUsername(String username);

    List<UtilisateurAfficheDto> listOfAllUtilisateurOrderbyName(Long idAgence);

    List<UtilisateurAfficheDto> listOfAllUtilisateurLocataireOrderbyName(Long idAgence);

    List<UtilisateurAfficheDto> listOfAllUtilisateurProprietaireOrderbyName(Long idAgence);

    List<UtilisateurAfficheDto> listOfAllUtilisateurGerantOrderbyName(Long idAgence);

    List<UtilisateurAfficheDto> listOfAllUtilisateurSuperviseurOrderbyName();

    void deleteLocatire(Long id);

    void deleteProprietaire(Long id);

    void deleteUtilisateur(Long idUtilisateur);

    void verifyAccount(String token);

    void feachUserAndEnable(VerificationToken verificationToken);

    List<UtilisateurAfficheDto> listOfAllUtilisateurLocataireOrderbyNameByAgence(Long idAgence);
    List<UtilisateurAfficheDto> listOfAllUtilisateurClientHotelOrderbyNameByAgence(Long idAgence);

    List<LocataireEncaisDTO> listOfLocataireAyantunbail(Long idAgence);

    List<LocataireEncaisDTO> listOfLocataireCompteClient(Long idAgence);

    UtilisateurAfficheDto desactiverUtilisateur(Long idUtilisateur);

    int desactiverUtilisateursInactifs();

    UtilisateurAfficheDto changerMotDePasse(ChangePasswordRequestDto requestDto);

    void demanderReinitialisationMotDePasse(PasswordResetRequestDto requestDto);

    void reinitialiserMotDePasse(PasswordResetConfirmationRequestDto requestDto);

    EtablissementUtilisateurDto affecterUtilisateurAEtablissement(UserEstablishmentAssignmentRequestDto requestDto);

    List<UtilisateurAfficheDto> listerUtilisateursParEtablissement(Long idEtablissement);

    ImportResultDto importUtilisateursFromExcel(MultipartFile file, Long idAgence, Long idCreateur);
}
