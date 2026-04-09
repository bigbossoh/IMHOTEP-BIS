import { OperationDto } from './../../../gs-api/src/models/operation-dto';
//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

import { BailAppartementDto } from 'src/gs-api/src/models';


//STORE
export enum BailAppartementActionsTypes {
  SAVE_BAIL_APPARTEMENT = '[BailMagasinDto] SAVE BAIL APPARTEMENT',
  SAVE_BAIL_APPARTEMENT_SUCCES = '[BailMagasinDto] SAVE BAIL MAGASIN APPARTEMENT',
  SAVE_BAIL_APPARTEMENT_ERROR = '[BailMagasinDto] GSAVE BAIL APPARTEMENT ERROR',


}
// CREER LES DIFFERENTES ACTIONS
export class SaveBailAppartementActions implements Action {
  type: BailAppartementActionsTypes = BailAppartementActionsTypes.SAVE_BAIL_APPARTEMENT;
  constructor(public payload: any) { }
}

export class SaveBailAppartementActionsSuccess implements Action {
  type: BailAppartementActionsTypes =
    BailAppartementActionsTypes.SAVE_BAIL_APPARTEMENT_SUCCES;
  constructor(public payload: OperationDto) { }
}
export class SaveBailAppartementActionsError implements Action {
  type: BailAppartementActionsTypes =
    BailAppartementActionsTypes.SAVE_BAIL_APPARTEMENT_ERROR;
  constructor(public payload: string) { }
}

export type BailAppartementnActions =
  | SaveBailAppartementActions
  | SaveBailAppartementActionsError
  | SaveBailAppartementActionsSuccess
