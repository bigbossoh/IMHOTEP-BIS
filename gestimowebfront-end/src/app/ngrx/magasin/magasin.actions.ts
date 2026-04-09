//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

import { MagasinDto } from 'src/gs-api/src/models';

//STORE
export enum MagasinActionsTypes {
  SAVE_MAGASIN = '[MagasinDto] Get Save Magasin',
  SAVE_MAGASIN_SUCCES = '[MagasinDto] Get save Magasin Succes',
  SAVE_MAGASIN_ERROR = '[MagasinDto] Get Save Magasin Error',

  GET_ALL_MAGASIN_LIBRE = '[MagasinDto] Get All Magasin Libre',
  GET_ALL_MAGASIN_LIBRE_SUCCES = '[MagasinDto] Get All Magasin Libre Succes',
  GET_ALL_MAGASIN_LIBRE_ERROR = '[MagasinDto] Get All Magasin Libre Error',

  GET_ALL_MAGASIN = '[MagasinDto] Get All Magasin',
  GET_ALL_MAGASIN_SUCCES = '[MagasinDto] Get All Magasin Succes',
  GET_ALL_MAGASIN_ERROR = '[MagasinDto] Get All Magasin Error',

  GET_MAGASIN_BY_ID = '[MagasinDto] Get Magasin BY ID',
  GET_MAGASIN_BY_ID_SUCCES = '[MagasinDto] Get Magasin BY ID Succes',
  GET_MAGASIN_BY_ID_ERROR = '[MagasinDto] Get Magasin BY ID Error',
}
// CREER LES DIFFERENTES ACTIONS
export class SaveMagasinActions implements Action {
  type: MagasinActionsTypes = MagasinActionsTypes.SAVE_MAGASIN;
  constructor(public payload: any) {}
}

export class SaveMagasinActionsSuccess implements Action {
  type: MagasinActionsTypes = MagasinActionsTypes.SAVE_MAGASIN_SUCCES;
  constructor(public payload: MagasinDto) {}
}
export class SaveMagasintActionsError implements Action {
  type: MagasinActionsTypes = MagasinActionsTypes.SAVE_MAGASIN_ERROR;
  constructor(public payload: string) {}
}

// GET ALL MGASIN LIBRE
export class GetAllMagasinLibreActions implements Action {
  type: MagasinActionsTypes = MagasinActionsTypes.GET_ALL_MAGASIN_LIBRE;
  constructor(public payload: any) {}
}

export class GetAllMagasinLibreActionsSuccess implements Action {
  type: MagasinActionsTypes = MagasinActionsTypes.GET_ALL_MAGASIN_LIBRE_SUCCES;
  constructor(public payload: MagasinDto[]) {}
}
export class GetAllMagasinLibreActionsError implements Action {
  type: MagasinActionsTypes = MagasinActionsTypes.GET_ALL_MAGASIN_LIBRE_ERROR;
  constructor(public payload: string) {}
}

// GET MAGASIN BY ID
export class GetMagasinByIdActions implements Action {
  type: MagasinActionsTypes = MagasinActionsTypes.GET_MAGASIN_BY_ID;
  constructor(public payload: number) {}
}

export class GetMagasinByIdActionsSuccess implements Action {
  type: MagasinActionsTypes = MagasinActionsTypes.GET_MAGASIN_BY_ID_SUCCES;
  constructor(public payload: MagasinDto) {}
}
export class GetMagasinByIdActionsError implements Action {
  type: MagasinActionsTypes = MagasinActionsTypes.GET_MAGASIN_BY_ID_ERROR;
  constructor(public payload: string) {}
}
// GET ALL MGASIN LIBRE
export class GetAllMagasinActions implements Action {
  type: MagasinActionsTypes = MagasinActionsTypes.GET_ALL_MAGASIN;
  constructor(public payload: any) {}
}

export class GetAllMagasinActionsSuccess implements Action {
  type: MagasinActionsTypes = MagasinActionsTypes.GET_ALL_MAGASIN_SUCCES;
  constructor(public payload: MagasinDto[]) {}
}
export class GetAllMagasinActionsError implements Action {
  type: MagasinActionsTypes = MagasinActionsTypes.GET_ALL_MAGASIN_ERROR;
  constructor(public payload: string) {}
}
export type MagasinActions =
  | SaveMagasinActions
  | SaveMagasinActionsSuccess
  | SaveMagasintActionsError
  | GetAllMagasinLibreActions
  | GetAllMagasinLibreActionsSuccess
  | GetAllMagasinLibreActionsError
  | GetAllMagasinActions
  | GetAllMagasinActionsSuccess
  | GetAllMagasinActionsError
  | GetMagasinByIdActions
  | GetMagasinByIdActionsError
  | GetMagasinByIdActionsSuccess;
