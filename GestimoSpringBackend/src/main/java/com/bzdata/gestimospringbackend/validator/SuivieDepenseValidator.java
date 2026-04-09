package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.util.StringUtils;

import com.bzdata.gestimospringbackend.DTOs.SuivieDepenseDto;

public class SuivieDepenseValidator {
   private static final Pattern PHONE_PATTERN = Pattern.compile("^[0-9+()\\-\\s]{6,20}$");

   public static List<String> validate(SuivieDepenseDto dto) {
      List<String> errors = new ArrayList<>();

      if (dto == null) {
         errors.add("L'objet est null.");
          return errors;
      }

     if(!StringUtils.hasLength(resolveLibelle(dto))){
      errors.add("Veuillez renseigner le libelle de la depense.");
     }
     if(!StringUtils.hasLength(resolveReference(dto))){
      errors.add("La reference de la depense est obligatoire.");
     }
     if(dto.getDateEncaissement() == null){
      errors.add("La date de la depense est obligatoire.");
     }
     if(!StringUtils.hasLength(dto.getCategorieDepense())){
      errors.add("La categorie de la depense est obligatoire.");
     }
     if(dto.getMontantDepense() == null || dto.getMontantDepense() <= 0){
      errors.add("Le montant de la depense doit etre strictement superieur a zero.");
     }
     if(!StringUtils.hasLength(dto.getModePaiement())){
      errors.add("Le mode de paiement est obligatoire.");
     }
     if(dto.getBienImmobilierId() == null){
      errors.add("Le bien immobilier est obligatoire.");
     }
     if("PAYEE".equalsIgnoreCase(dto.getStatutPaiement()) && dto.getDatePaiement() == null){
      errors.add("La date de paiement est obligatoire pour une depense payee.");
     }
     if(StringUtils.hasLength(dto.getFournisseurTelephone()) && !PHONE_PATTERN.matcher(dto.getFournisseurTelephone().trim()).matches()){
      errors.add("Le telephone du fournisseur est invalide.");
     }
      return errors;
  }

  private static String resolveLibelle(SuivieDepenseDto dto) {
    if (StringUtils.hasLength(dto.getLibelleDepense())) {
      return dto.getLibelleDepense();
    }
    return dto.getDesignation();
  }

  private static String resolveReference(SuivieDepenseDto dto) {
    if (StringUtils.hasLength(dto.getReferenceDepense())) {
      return dto.getReferenceDepense();
    }
    return dto.getCodeTransaction();
  }
}
