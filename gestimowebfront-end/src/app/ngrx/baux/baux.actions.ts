//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

import { OperationDto } from 'src/gs-api/src/models';

//STORE
export enum OperationActionsTypes {
  CLOTURE_BAIL = '[OperationDto] Bail Cloturer',
  CLOTURE_BAIL_SUCCES = '[OperationDto] Bail Cloturer Succes',
  CLOTURE_BAIL_ERROR = '[OperationDto] Bail Cloturer Error',

  SUPPRIMER_BAIL = '[OperationDto] Bail suppr',
  SUPPRIMER_BAIL_SUCCES = '[OperationDto] Bail suppr Succes',
  SUPPRIMER_BAIL_ERROR = '[OperationDto] Bail suppr Error',

  GET_ALL_BAIL = '[OperationDto] Get All OperationDto',
  GET_ALL_BAIL_SUCCES = '[OperationDto] Get All OperationDto Succes',
  GET_ALL_BAIL_ERROR = '[OperationDto] Get All OperationDto Error',

  GET_ALL_BIEN_BAIL_BY_LOCATAIRE = '[OperationDto] Get All Biens By locataire',
  GET_ALL_BIEN_BAIL_BY_LOCATAIRE_SUCCES = '[OperationDto] Get All Biens By Locataires Succes',
  GET_ALL_BIEN_BAIL_BY_LOCATAIRE_ERROR = '[OperationDto] Get All Biens By locataires Error',

  FIND_BAIL_BY_ID = '[OperationDto] Bail ID',
  FIND_BAIL_BY_ID_SUCCES = '[OperationDto] Bail ID Succes',
  FIND_BAIL_BY_ID_ERROR = '[OperationDto] Bail ID Error',

  MODIFIER_BAIL = '[OperationDto] MODIFIER BAIL',
  MODIFIER_BAIL_SUCCES = '[OperationDto] MODIFIER BAIL Succes',
  MODIFIER_BAIL_ERROR = '[OperationDto] MODIFIER BAIL Error',
}

// GET ALL BAUX
export class FindBailByIdActions implements Action {
  type: OperationActionsTypes = OperationActionsTypes.FIND_BAIL_BY_ID;
  constructor(public payload: number) {}
}

export class FindBailByIdActionsSuccess implements Action {
  type: OperationActionsTypes = OperationActionsTypes.FIND_BAIL_BY_ID_SUCCES;
  constructor(public payload: OperationDto) {}
}
export class FindBailByIdActionsError implements Action {
  type: OperationActionsTypes = OperationActionsTypes.FIND_BAIL_BY_ID_ERROR;
  constructor(public payload: string) {}
}

// GET ALL BAUX
export class ModifierBailActions implements Action {
  type: OperationActionsTypes = OperationActionsTypes.MODIFIER_BAIL;
  constructor(public payload: any) {}
}

export class ModifierBailActionsSuccess implements Action {
  type: OperationActionsTypes = OperationActionsTypes.MODIFIER_BAIL_SUCCES;
  constructor(public payload: OperationDto) {}
}
export class ModifierBailActionsError implements Action {
  type: OperationActionsTypes = OperationActionsTypes.MODIFIER_BAIL_ERROR;
  constructor(public payload: string) {}
}

// GET ALL BAUX
export class GetAllOperationActions implements Action {
  type: OperationActionsTypes = OperationActionsTypes.GET_ALL_BAIL;
  constructor(public payload: any) {}
}

export class GetAllOperationActionsSuccess implements Action {
  type: OperationActionsTypes = OperationActionsTypes.GET_ALL_BAIL_SUCCES;
  constructor(public payload: OperationDto[]) {}
}
export class GetAllOperationActionsError implements Action {
  type: OperationActionsTypes = OperationActionsTypes.GET_ALL_BAIL_ERROR;
  constructor(public payload: string) {}
}

// GET ALL BIENS BY LOCATAIRES
export class GetAllBientaireByLocatairesActions implements Action {
  type: OperationActionsTypes =
    OperationActionsTypes.GET_ALL_BIEN_BAIL_BY_LOCATAIRE;
  constructor(public payload: any) {}
}

export class GetAllBientaireByLocatairesActionsSuccess implements Action {
  type: OperationActionsTypes =
    OperationActionsTypes.GET_ALL_BIEN_BAIL_BY_LOCATAIRE_SUCCES;
  constructor(public payload: OperationDto[]) {}
}
export class GetAllBientaireByLocatairesActionsError implements Action {
  type: OperationActionsTypes =
    OperationActionsTypes.GET_ALL_BIEN_BAIL_BY_LOCATAIRE_ERROR;
  constructor(public payload: string) {}
}

// CLOTURE BAIL
export class ClotureOperationActions implements Action {
  type: OperationActionsTypes = OperationActionsTypes.CLOTURE_BAIL;
  constructor(public payload: number) {}
}

export class ClotureOperationActionsSuccess implements Action {
  type: OperationActionsTypes = OperationActionsTypes.CLOTURE_BAIL_SUCCES;
  constructor(public payload: any) {}
}
export class ClotureOperationActionsError implements Action {
  type: OperationActionsTypes = OperationActionsTypes.CLOTURE_BAIL_ERROR;
  constructor(public payload: string) {}
}

// SUPPRIMER BAIL
export class SupprimerOperationActions implements Action {
  type: OperationActionsTypes = OperationActionsTypes.SUPPRIMER_BAIL;
  constructor(public payload: number) {}
}

export class SupprimerOperationActionsSuccess implements Action {
  type: OperationActionsTypes = OperationActionsTypes.SUPPRIMER_BAIL_SUCCES;
  constructor(public payload: boolean) {}
}
export class SupprimerOperationActionsError implements Action {
  type: OperationActionsTypes = OperationActionsTypes.SUPPRIMER_BAIL_ERROR;
  constructor(public payload: string) {}
}
export type OperationActions =
  | GetAllOperationActions
  | GetAllOperationActionsError
  | GetAllOperationActionsSuccess
  | ClotureOperationActions
  | ClotureOperationActionsError
  | ClotureOperationActionsSuccess
  | GetAllBientaireByLocatairesActions
  | GetAllBientaireByLocatairesActionsError
  | GetAllBientaireByLocatairesActionsSuccess
  | SupprimerOperationActions
  | SupprimerOperationActionsSuccess
  | SupprimerOperationActionsError
  | FindBailByIdActions
  | FindBailByIdActionsError
  | FindBailByIdActionsSuccess
  | ModifierBailActions
  | ModifierBailActionsError
  | ModifierBailActionsSuccess;
