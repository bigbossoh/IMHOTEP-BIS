//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

import { EtageAfficheDto, EtageDto } from 'src/gs-api/src/models';

//STORE
export enum EtagesActionsTypes {
  GET_ALL_ETAGES = '[EtageDto] Get All Etage',
  GET_ALL_ETAGES_SUCCES = '[EtageDto] Get All Etage Succes',
  GET_ALL_ETAGES_ERROR = '[EtageDto] Get All Etage Error',

  //GET ETAGE BY IMMEUBLE
  GET_ALL_ETAGES_BY_IMMEUBLE = '[EtageDto] Get All Etage BY IMMEUBLE',
  GET_ALL_ETAGES_BY_IMMEUBLE_SUCCES = '[EtageDto] Get All Etage BY IMMEUBLE SUCCUS',
  GET_ALL_ETAGES_BY_IMMEUBLE_ERROR = '[EtageDto] Get All Etage BY IMMEUBLE ERROR',

  //SAVE ETAGE BY IMMEUBLE
  SAVE_ETAGE = '[EtageDto] SAVE ETAGE',
  SAVE_ETAGE_SUCCES = '[EtageDto] SAVE ETAGE SUCCES',
  SAVE_ETAGE_ERROR = '[EtageDto] SAVE ETAGE ERROR'
}
// CREER LES DIFFERENTES ACTIONS
export class GetAllEtagesActions implements Action {
  type: EtagesActionsTypes = EtagesActionsTypes.GET_ALL_ETAGES;
  constructor(public payload: any) { }
}

export class GetAllEtagesActionsSuccess implements Action {
  type: EtagesActionsTypes =
    EtagesActionsTypes.GET_ALL_ETAGES_SUCCES;
  constructor(public payload: EtageAfficheDto[]) { }
}
export class GetAllEtagesActionsError implements Action {
  type: EtagesActionsTypes =
    EtagesActionsTypes.GET_ALL_ETAGES_ERROR;
  constructor(public payload: string) { }
}
//RECHERCHER ETAGE PAR IMMEUBLE

export class GetAllEtagesByImmeubleActions implements Action {
  type: EtagesActionsTypes = EtagesActionsTypes.GET_ALL_ETAGES_BY_IMMEUBLE;
  constructor(public payload: number) { }
}

export class GetAllEtagesByImmeubleActionsSuccess implements Action {
  type: EtagesActionsTypes =
    EtagesActionsTypes.GET_ALL_ETAGES_BY_IMMEUBLE_SUCCES;
  constructor(public payload: EtageAfficheDto[]) { }
}
export class GetAllEtagesByImmeubleActionsError implements Action {
  type: EtagesActionsTypes =
    EtagesActionsTypes.GET_ALL_ETAGES_BY_IMMEUBLE_ERROR;
  constructor(public payload: string) { }
}
//SAVE NEW ETAGE

export class SaveEtageActions implements Action {
  type: EtagesActionsTypes = EtagesActionsTypes.SAVE_ETAGE;
  constructor(public payload: EtageAfficheDto) { }
}

export class SaveEtageActionsSuccess implements Action {
  type: EtagesActionsTypes =
    EtagesActionsTypes.SAVE_ETAGE_SUCCES;
  constructor(public payload: any) { }
}
export class SaveEtageActionsError implements Action {
  type: EtagesActionsTypes =
    EtagesActionsTypes.SAVE_ETAGE_ERROR;
  constructor(public payload: string) { }
}
export type EtagesActions =
  | GetAllEtagesActions
  | GetAllEtagesActionsError
  | GetAllEtagesActionsSuccess

  | GetAllEtagesByImmeubleActions
  | GetAllEtagesByImmeubleActionsError
  | GetAllEtagesByImmeubleActionsSuccess
  | SaveEtageActions
  | SaveEtageActionsError
  | SaveEtageActionsSuccess;
