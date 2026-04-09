import { Action } from '@ngrx/store';

import { AppelLoyersFactureDto } from '../../../gs-api/src/models/appel-loyers-facture-dto';
import { EncaissementPayloadDto } from '../../../gs-api/src/models/encaissement-payload-dto';
//STORE
export enum EncaissementActionsTypes {
  //GET ETAGE BY IMMEUBLE
  SAVE_ENCAISSEMENT = '[EncaissementPayloadDto] Save Encaissement',
  SAVE_ENCAISSEMENT_SUCCES = '[EncaissementPayloadDto] Save Encaissement SUCCES',
  SAVE_ENCAISSEMENT_ERROR = '[EncaissementPayloadDto] Save Encaissement ERROR',

  SAVE_ENCAISSEMENT_GROUPE = '[EncaissementPayloadDto] Save Encaissement GRPOUE',
  SAVE_ENCAISSEMENT_GROUPE_SUCCES = '[EncaissementPayloadDto] Save Encaissement GROUPE SUCCES',
  SAVE_ENCAISSEMENT_GROUPE_ERROR = '[EncaissementPayloadDto] Save Encaissement GROUPE ERROR',

  GET_ENCAISSEMENT_BY_BIEN = '[EncaissementPayloadDto] Get Encaissement By Bien',
  GET_ENCAISSEMENT_BY_BIEN_SUCCES = '[EncaissementPayloadDto] Get Encaissement By Bien SUCCES',
  GET_ENCAISSEMENT_BY_BIEN_ERROR = '[EncaissementPayloadDto] Get Encaissement By Bien ERROR',
  //
  GET_ALL_PERIODE_REGLEMENT_BY_BIEN = '[AppelLoyersFactureDto] Get All periode By bien',
  GET_ALL_PERIODE_REGLEMENT_BY_BIEN_SUCCES = '[AppelLoyersFactureDto] Get All periode By bien Succes',
  GET_ALL_PERIODE_REGLEMENT_BY_BIEN_ERROR = '[AppelLoyersFactureDto] Get All periode By bien Error',

  TOTAL_ENCAISSEMENT_PAR_JOUR = 'TOTAL ENCAISSEMENT ',
  TOTAL_ENCAISSEMENT_PAR_JOUR_SUCCES = 'TOTAL ENCAISSEMENT SUCCES',
  TOTAL_ENCAISSEMENT_PAR_JOUR_ERROR = 'TOTAL ENCAISSEMENT ERROR',

  GET_LOCATAIRE_ENCAISSEMENT = '[UtilisateurRequestDto] Get All Locataires Pour encaissement',
  GET_LOCATAIRE_ENCAISSEMENT_SUCCES = '[UtilisateurRequestDto] Get All Locataires Pour encaissement Succes',
  GET_LOCATAIRE_ENCAISSEMENT_ERROR = '[UtilisateurRequestDto] Get All Locataires Pour encaissement Error',

  GET_LISTE_LOCATAIRE_ENCAISSEMENT = '[UtilisateurRequestDto] Get LISTE Locataires Pour encaissement',
  GET_LISTE_LOCATAIRE_ENCAISSEMENT_SUCCES = '[UtilisateurRequestDto] Get LISTE Locataires Pour encaissement Succes',
  GET_LISTE_LOCATAIRE_ENCAISSEMENT_ERROR = '[UtilisateurRequestDto] Get LISTE Locataires Pour encaissement Error',

  TOTAL_ENCAISSEMENT_ENTRE_DEUX_DATE = 'TOTAL ENCAISSEMENT ENTRE DEUX DATES ',
  TOTAL_ENCAISSEMENT_ENTRE_DEUX_DATE_SUCCES = 'TOTAL ENCAISSEMENT ENTRE DEUX DATES SUCCES',
  TOTAL_ENCAISSEMENT_ENTRE_DEUX_DATE_ERROR = 'TOTAL ENCAISSEMENT ENTRE DEUX DATES ERROR',

  SOMME_ENCAISSEMENT_ENTRE_DEUX_DATE = 'SOMME ENCAISSEMENT ENTRE DEUX DATES ',
  SOMME_ENCAISSEMENT_ENTRE_DEUX_DATE_SUCCES = 'SOMME ENCAISSEMENT ENTRE DEUX DATES SUCCES',
  SOMME_ENCAISSEMENT_ENTRE_DEUX_DATE_ERROR = 'SOMME ENCAISSEMENT ENTRE DEUX DATES ERROR',

  SOMME_DUE_ENTRE_DEUX_DATE = 'SOMME DUE ENTRE DEUX DATES ',
  SOMME_DUE_ENTRE_DEUX_DATE_SUCCES = 'SOMME DUE ENTRE DEUX DATES SUCCES',
  SOMME_DUE_ENTRE_DEUX_DATE_ERROR = 'SOMME DUE ENTRE DEUX DATES ERROR',

  GET_ENCAISSEMENT_CLOTURE = ' Get All Locataires Pour CLOTURE',
  GET_ENCAISSEMENT_CLOTURE_SUCCES = 'Get All Locataires Pour encaissement CLOTURE Succes',
  GET_ENCAISSEMENT_CLOTURE_ERROR = 'Get All Locataires Pour encaissement  CLOTUREError',
}

export class SaveEncaissementActions implements Action {
  type: EncaissementActionsTypes = EncaissementActionsTypes.SAVE_ENCAISSEMENT;
  constructor(public payload: any) {}
}

export class SaveEncaissementActionsSuccess implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.SAVE_ENCAISSEMENT_SUCCES;
  constructor(public payload: any) {}
}
export class SaveEncaissementActionsError implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.SAVE_ENCAISSEMENT_ERROR;
  constructor(public payload: string) {}
}
export class SaveEncaissementGroupeActions implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.SAVE_ENCAISSEMENT_GROUPE;
  constructor(public payload: any) {}
}

export class SaveEncaissementGroupeActionsSuccess implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.SAVE_ENCAISSEMENT_GROUPE_SUCCES;
  constructor(public payload: any) {}
}
export class SaveEncaissementGroupeActionsError implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.SAVE_ENCAISSEMENT_GROUPE_ERROR;
  constructor(public payload: string) {}
}
// GET ALL PERIODE BY BIEN
export class GetAllPeriodeReglementByBienActions implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_ALL_PERIODE_REGLEMENT_BY_BIEN;
  constructor(public payload: any) {}
}

export class GetAllPeriodeReglementByBienActionsSuccess implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_ALL_PERIODE_REGLEMENT_BY_BIEN_SUCCES;
  constructor(public payload: AppelLoyersFactureDto) {}
}
export class GetAllPeriodeReglementByBienActionsError implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_ALL_PERIODE_REGLEMENT_BY_BIEN_ERROR;
  constructor(public payload: string) {}
}

// GET ALL PERIODE BY BIEN
export class GetEncaissementBienActions implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_ENCAISSEMENT_BY_BIEN;
  constructor(public payload: number) {}
}

export class GetEncaissementBienActionsSuccess implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_ENCAISSEMENT_BY_BIEN_SUCCES;
  constructor(public payload: any) {}
}
export class GetEncaissementBienActionsError implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_ENCAISSEMENT_BY_BIEN_ERROR;
  constructor(public payload: string) {}
}
// GET TOTAL ENCAISSEMENT6
export class TotalEncaissementParJourActions implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.TOTAL_ENCAISSEMENT_PAR_JOUR;
  constructor(public payload: any) {}
}

export class TotalEncaissementParJourActionsSuccess implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.TOTAL_ENCAISSEMENT_PAR_JOUR_SUCCES;
  constructor(public payload: any) {}
}
export class TotalEncaissementParJourActionsError implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.TOTAL_ENCAISSEMENT_PAR_JOUR_ERROR;
  constructor(public payload: string) {}
}

// SAVE UN UTILISATEUR
export class GetLocataireEncaissementActions implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_LOCATAIRE_ENCAISSEMENT;
  constructor(public payload: any) {}
}

export class GetLocataireEncaissementActionsSuccess implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_LOCATAIRE_ENCAISSEMENT_SUCCES;
  constructor(public payload: any) {}
}
export class GetLocataireEncaissementActionsError implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_LOCATAIRE_ENCAISSEMENT_ERROR;
  constructor(public payload: string) {}
}

// LIST UN UTILISATEUR
export class GetListImayerLocataireEncaissementPeriodeActions
  implements Action
{
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_LISTE_LOCATAIRE_ENCAISSEMENT;
  constructor(public payload: any) {}
}

export class GetListImayerLocataireEncaissementPeriodeActionsSuccess
  implements Action
{
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_LISTE_LOCATAIRE_ENCAISSEMENT_SUCCES;
  constructor(public payload: any) {}
}
export class GetListImayerLocataireEncaissementPeriodeActionsError
  implements Action
{
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_LISTE_LOCATAIRE_ENCAISSEMENT_ERROR;
  constructor(public payload: string) {}
}
// GET TOTAL ENCAISSEMENTS ENTRE DEUX DATES
export class TotalEncaissementEntreDeuxDatesActions implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.TOTAL_ENCAISSEMENT_ENTRE_DEUX_DATE;
  constructor(public payload: any) {}
}

export class TotalEncaissementEntreDeuxDatesActionsSuccess implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.TOTAL_ENCAISSEMENT_ENTRE_DEUX_DATE_SUCCES;
  constructor(public payload: any) {}
}
export class TotalEncaissementEntreDeuxDatesActionsError implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.TOTAL_ENCAISSEMENT_ENTRE_DEUX_DATE_ERROR;
  constructor(public payload: string) {}
}

// GET SOMME ENCAISSEMENTS ENTRE DEUX DATES
export class SommeEncaissementEntreDeuxDatesActions implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.SOMME_ENCAISSEMENT_ENTRE_DEUX_DATE;
  constructor(public payload: any) {}
}

export class SommeEncaissementEntreDeuxDatesActionsSuccess implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.SOMME_ENCAISSEMENT_ENTRE_DEUX_DATE_SUCCES;
  constructor(public payload: any) {}
}
export class SommeEncaissementEntreDeuxDatesActionsError implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.SOMME_ENCAISSEMENT_ENTRE_DEUX_DATE_ERROR;
  constructor(public payload: string) {}
}
// GET SOMME ENCAISSEMENTS ENTRE DEUX DATES
export class SommeDueEntreDeuxDatesActions implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.SOMME_DUE_ENTRE_DEUX_DATE;
  constructor(public payload: any) {}
}

export class SommeDuentreDeuxDatesActionsSuccess implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.SOMME_DUE_ENTRE_DEUX_DATE_SUCCES;
  constructor(public payload: any) {}
}
export class SommeDueEntreDeuxDatesActionsError implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.SOMME_DUE_ENTRE_DEUX_DATE_ERROR;
  constructor(public payload: string) {}
}
////////
export class GetAllEncaissementClotureActions implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_ENCAISSEMENT_CLOTURE;
  constructor(public payload: any) {}
}

export class GetAllEncaissementClotureActionsSuccess implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_ENCAISSEMENT_CLOTURE_SUCCES;
  constructor(public payload: any) {}
}
export class GetAllEncaissementClotureActionsError implements Action {
  type: EncaissementActionsTypes =
    EncaissementActionsTypes.GET_ENCAISSEMENT_CLOTURE_ERROR;
  constructor(public payload: string) {}
}

export type EncaissementActions =
  | SaveEncaissementActions
  | SaveEncaissementActionsError
  | SaveEncaissementActionsSuccess
  | GetAllPeriodeReglementByBienActions
  | GetAllPeriodeReglementByBienActionsSuccess
  | GetAllPeriodeReglementByBienActionsError
  | GetEncaissementBienActions
  | GetEncaissementBienActionsError
  | GetEncaissementBienActionsSuccess
  | TotalEncaissementParJourActions
  | TotalEncaissementParJourActionsError
  | TotalEncaissementParJourActionsSuccess
  | GetLocataireEncaissementActions
  | GetLocataireEncaissementActionsError
  | GetLocataireEncaissementActionsSuccess
  | GetListImayerLocataireEncaissementPeriodeActions
  | GetListImayerLocataireEncaissementPeriodeActionsError
  | GetListImayerLocataireEncaissementPeriodeActionsSuccess
  | SaveEncaissementGroupeActions
  | SaveEncaissementGroupeActionsSuccess
  | SaveEncaissementGroupeActionsError
  | TotalEncaissementEntreDeuxDatesActions
  | TotalEncaissementEntreDeuxDatesActionsSuccess
  | TotalEncaissementEntreDeuxDatesActionsError
  | SommeEncaissementEntreDeuxDatesActions
  | SommeEncaissementEntreDeuxDatesActionsError
  | SommeEncaissementEntreDeuxDatesActionsSuccess
  | SommeDueEntreDeuxDatesActions
  | SommeDueEntreDeuxDatesActionsError
  | SommeDuentreDeuxDatesActionsSuccess
  | GetAllEncaissementClotureActions
  | GetAllEncaissementClotureActionsSuccess
  | GetAllEncaissementClotureActionsError;
