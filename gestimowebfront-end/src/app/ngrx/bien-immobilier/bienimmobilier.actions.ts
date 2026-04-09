//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

import { Bienimmobilier } from 'src/gs-api/src/models';
import { BienImmobilierAffiheDto } from '../../../gs-api/src/models/bien-immobilier-affihe-dto';

//STORE
export enum BienImmobilierActionsTypes {
  GET_ALL_BIENS = '[BienImmobilierAffiheDto] Get All Biens Immobilier',
  GET_ALL_BIENS_SUCCES = '[BienImmobilierAffiheDto] Get All Biens Immobilier Succes',
  GET_ALL_BIENS_ERROR = '[BienImmobilierAffiheDto] Get All Biens Immobilier Error',

  //NOUVEAU BIEN IMMOBILIER
  NEW_BIENS = '[BienImmobilierDto] New Biens Immobilier',
  NEW_BIENS_SUCCES = '[BienImmobilierDto] New Biens Immobilier Succes',
  NEW_BIENS_ERROR = '[BienImmobilierDto] New Biens Immobilier Error',

  //NOUVEAU BIEN IMMOBILIER
  RATTACHER_BIEN_CHAPITRE = '[BienImmobilierDto] RATTACHER Biens Immobilier',
  RATTACHER_BIEN_CHAPITRE_BIENS_SUCCES = '[BienImmobilierDto] RATTACHER Biens Immobilier Succes',
  RATTACHER_BIEN_CHAPITRE_BIENS_ERROR = '[BienImmobilierDto] RATTACHER Biens Immobilier Error',
}
// CREER LES DIFFERENTES ACTIONS
export class GetAllBiensActions implements Action {
  type: BienImmobilierActionsTypes = BienImmobilierActionsTypes.GET_ALL_BIENS;
  constructor(public payload: any) {}
}

export class GetAllBiensActionsSuccess implements Action {
  type: BienImmobilierActionsTypes =
    BienImmobilierActionsTypes.GET_ALL_BIENS_SUCCES;
  constructor(public payload: BienImmobilierAffiheDto[]) {}
}
export class GetAllBiensActionsError implements Action {
  type: BienImmobilierActionsTypes =
    BienImmobilierActionsTypes.GET_ALL_BIENS_ERROR;
  constructor(public payload: string) {}
}
// CREER NOUVEAU LES DIFFERENTES ACTIONS
export class NewBiensActions implements Action {
  type: BienImmobilierActionsTypes = BienImmobilierActionsTypes.NEW_BIENS;
  constructor(public payload: any) {}
}

export class NewBiensActionsSuccess implements Action {
  type: BienImmobilierActionsTypes =
    BienImmobilierActionsTypes.NEW_BIENS_SUCCES;
  constructor(public payload: BienImmobilierAffiheDto) {}
}
export class NewBiensActionsError implements Action {
  type: BienImmobilierActionsTypes = BienImmobilierActionsTypes.NEW_BIENS_ERROR;
  constructor(public payload: string) {}
}

// CREER NOUVEAU LES DIFFERENTES ACTIONS
export class RattacherBiensChapitreActions implements Action {
  type: BienImmobilierActionsTypes =
    BienImmobilierActionsTypes.RATTACHER_BIEN_CHAPITRE;
  constructor(public payload: any) {}
}

export class RattacherBiensChapitreActionsSuccess implements Action {
  type: BienImmobilierActionsTypes =
    BienImmobilierActionsTypes.RATTACHER_BIEN_CHAPITRE_BIENS_SUCCES;
  constructor(public payload: BienImmobilierAffiheDto) {}
}
export class RattacherBiensChapitreActionsError implements Action {
  type: BienImmobilierActionsTypes =
    BienImmobilierActionsTypes.RATTACHER_BIEN_CHAPITRE_BIENS_ERROR;
  constructor(public payload: string) {}
}
export type BienImmobilierActions =
  | GetAllBiensActions
  | GetAllBiensActionsError
  | GetAllBiensActionsSuccess
  | NewBiensActions
  | NewBiensActionsError
  | NewBiensActionsSuccess
  | RattacherBiensChapitreActions
  | RattacherBiensChapitreActionsError
  | RattacherBiensChapitreActionsSuccess;
