//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

import { UtilisateurRequestDto } from 'src/gs-api/src/models';

//STORE
export enum UtilisateurActionsTypes {
  GET_ALL_PROPRIETAIRES = '[UtilisateurRequestDto] Get All Proprietaires',
  GET_ALL_PROPRIETAIRES_SUCCES = '[UtilisateurRequestDto] Get All Proprietaires Succes',
  GET_ALL_PROPRIETAIRES_ERROR = '[UtilisateurRequestDto] Get All Proprietaires Error',

  GET_ALL_LOCATAIRES_BAIL = '[UtilisateurRequestDto] Get All Locataires Bail',
  GET_ALL_LOCATAIRES_BAIL_SUCCES = '[UtilisateurRequestDto] Get All Locataires Bail Succes',
  GET_ALL_LOCATAIRES_BAIL_ERROR = '[UtilisateurRequestDto] Get All Locataires Bail Error',

  GET_ALL_LOCATAIRES = '[UtilisateurRequestDto] Get All Locataires',
  GET_ALL_LOCATAIRES_SUCCES = '[UtilisateurRequestDto] Get All Locataires Succes',
  GET_ALL_LOCATAIRES_ERROR = '[UtilisateurRequestDto] Get All Locataires Error',

  SAVE_USER = '[UtilisateurRequestDto] Save User',
  SAVE_USER_SUCCES = '[UtilisateurRequestDto] Save User Succes',
  SAVE_USER_ERROR = '[UtilisateurRequestDto] Save User Error',

  GET_ALL_UTLISATEUR = '[UtilisateurRequestDto] Get All Utilisateur',
  GET_ALL_UTLISATEUR_SUCCES = '[UtilisateurRequestDto] Get All Utilisateur Succes',
  GET_ALL_UTLISATEUR_ERROR = '[UtilisateurRequestDto] Get All Utilisateur Error',
}
// CREER LES DIFFERENTES ACTIONS
export class GetAllProprietairesActions implements Action {
  type: UtilisateurActionsTypes = UtilisateurActionsTypes.GET_ALL_PROPRIETAIRES;
  constructor(public payload: any) {}
}

export class GetAllProprietairesActionsSuccess implements Action {
  type: UtilisateurActionsTypes =
    UtilisateurActionsTypes.GET_ALL_PROPRIETAIRES_SUCCES;
  constructor(public payload: UtilisateurRequestDto[]) {}
}
export class GetAllProprietairesActionsError implements Action {
  type: UtilisateurActionsTypes =
    UtilisateurActionsTypes.GET_ALL_PROPRIETAIRES_ERROR;
  constructor(public payload: string) {}
}
// LISTE DES LOCATAIRES BAIL
export class GetAllLocatairesBailActions implements Action {
  type: UtilisateurActionsTypes =
    UtilisateurActionsTypes.GET_ALL_LOCATAIRES_BAIL;
  constructor(public payload: any) {}
}

export class GetAllLocatairesBailActionsSuccess implements Action {
  type: UtilisateurActionsTypes =
    UtilisateurActionsTypes.GET_ALL_LOCATAIRES_BAIL_SUCCES;
  constructor(public payload: any) {}
}
export class GetAllLocatairesBailActionsError implements Action {
  type: UtilisateurActionsTypes =
    UtilisateurActionsTypes.GET_ALL_LOCATAIRES_BAIL_ERROR;
  constructor(public payload: string) {}
}
// LISTE DES LOCATAIRES
export class GetAllLocatairesActions implements Action {
  type: UtilisateurActionsTypes = UtilisateurActionsTypes.GET_ALL_LOCATAIRES;
  constructor(public payload: any) {}
}

export class GetAllLocatairesActionsSuccess implements Action {
  type: UtilisateurActionsTypes =
    UtilisateurActionsTypes.GET_ALL_LOCATAIRES_SUCCES;
  constructor(public payload: UtilisateurRequestDto[]) {}
}
export class GetAllLocatairesActionsError implements Action {
  type: UtilisateurActionsTypes =
    UtilisateurActionsTypes.GET_ALL_LOCATAIRES_ERROR;
  constructor(public payload: string) {}
}
// LISTE DES UTILISATEURS
export class GetAllUtilisateursActions implements Action {
  type: UtilisateurActionsTypes = UtilisateurActionsTypes.GET_ALL_UTLISATEUR;
  constructor(public payload: any) {}
}

export class GetAllUtilisateursActionsSuccess implements Action {
  type: UtilisateurActionsTypes =
    UtilisateurActionsTypes.GET_ALL_UTLISATEUR_SUCCES;
  constructor(public payload: UtilisateurRequestDto[]) {}
}
export class GetAllUtilisateursActionsError implements Action {
  type: UtilisateurActionsTypes =
    UtilisateurActionsTypes.GET_ALL_UTLISATEUR_ERROR;
  constructor(public payload: string) {}
}
// SAVE UN UTILISATEUR
export class SaveUserActions implements Action {
  type: UtilisateurActionsTypes = UtilisateurActionsTypes.SAVE_USER;
  constructor(public payload: any) {}
}

export class SaveUserActionsSuccess implements Action {
  type: UtilisateurActionsTypes = UtilisateurActionsTypes.SAVE_USER_SUCCES;
  constructor(public payload: UtilisateurRequestDto) {}
}
export class SaveUserActionsError implements Action {
  type: UtilisateurActionsTypes = UtilisateurActionsTypes.SAVE_USER_ERROR;
  constructor(public payload: string) {}
}

export type UtilisateurActions =
  | GetAllProprietairesActions
  | GetAllProprietairesActionsError
  | GetAllProprietairesActionsSuccess
  | GetAllLocatairesBailActions
  | GetAllLocatairesBailActionsError
  | GetAllLocatairesBailActionsSuccess
  | SaveUserActions
  | SaveUserActionsSuccess
  | SaveUserActionsError
  | GetAllUtilisateursActions
  | GetAllUtilisateursActionsError
  | GetAllUtilisateursActionsSuccess
  | GetAllLocatairesActions
  | GetAllLocatairesActionsError
  | GetAllLocatairesActionsSuccess;
