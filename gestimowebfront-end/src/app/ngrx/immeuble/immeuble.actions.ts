//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

import { ImmeubleDto, ImmeubleEtageDto } from 'src/gs-api/src/models';

//STORE
export enum ImmeublesActionsTypes {
  GET_ALL_IMMEUBLES = '[ImmeubleDto] Get All Immeuble',
  GET_ALL_IMMEUBLES_SUCCES = '[ImmeubleDto] Get All Immeuble Succes',
  GET_ALL_IMMEUBLES_ERROR = '[ImmeubleDto] Get All Immeuble Error',

  //IMMEUBLE SAVE
  SAVE_IMMEUBLES = '[ImmeubleDto] SAVE Immeuble',
  SAVE_IMMEUBLES_SUCCES = '[ImmeubleDto] SAVE Immeuble Succes',
  SAVE_IMMEUBLES_ERROR = '[ImmeubleDto] SAVE Immeuble Error',
}
// CREER LES DIFFERENTES ACTIONS
export class GetAllImmeublesActions implements Action {
  type: ImmeublesActionsTypes = ImmeublesActionsTypes.GET_ALL_IMMEUBLES;
  constructor(public payload: any) { }
}

export class GetAllImmeublesActionsSuccess implements Action {
  type: ImmeublesActionsTypes =
    ImmeublesActionsTypes.GET_ALL_IMMEUBLES_SUCCES;
  constructor(public payload: ImmeubleEtageDto[]) { }
}
export class GetAllImmeublesActionsError implements Action {
  type: ImmeublesActionsTypes =
    ImmeublesActionsTypes.GET_ALL_IMMEUBLES_ERROR;
  constructor(public payload: string) { }
}
//SAVE ACTIONS
// CREER LES DIFFERENTES ACTIONS
export class SaveImmeublesActions implements Action {
  type: ImmeublesActionsTypes = ImmeublesActionsTypes.SAVE_IMMEUBLES;
  constructor(public payload: any) { }
}

export class SaveImmeublesActionsSuccess implements Action {
  type: ImmeublesActionsTypes =
    ImmeublesActionsTypes.SAVE_IMMEUBLES_SUCCES;
  constructor(public payload: ImmeubleEtageDto) { }
}
export class SaveImmeublesActionsError implements Action {
  type: ImmeublesActionsTypes =
    ImmeublesActionsTypes.GET_ALL_IMMEUBLES_ERROR;
  constructor(public payload: string) { }
}
export type ImmeublesActions =
  | GetAllImmeublesActions
  | GetAllImmeublesActionsError
  | GetAllImmeublesActionsSuccess
  | SaveImmeublesActions
  | SaveImmeublesActionsError
  | SaveImmeublesActionsSuccess;
