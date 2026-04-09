//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

import { BailVillaDto } from 'src/gs-api/src/models';

//STORE
export enum BailVillaActionsTypes {
  SAVE_BAIL_VILLA = '[BailVillaDto] SAVE BAIL VILLA',
  SAVE_BAIL_VILLA_SUCCES = '[BailVillaDto] SAVE BAIL VILLA Succes',
  SAVE_BAIL_VILLA_ERROR = '[BailVillaDto] GSAVE BAIL VILLA Error',


}
// CREER LES DIFFERENTES ACTIONS
export class SaveBailVillaActions implements Action {
  type: BailVillaActionsTypes = BailVillaActionsTypes.SAVE_BAIL_VILLA;
  constructor(public payload: any) { }
}

export class SaveBailVillaActionsSuccess implements Action {
  type: BailVillaActionsTypes =
    BailVillaActionsTypes.SAVE_BAIL_VILLA_SUCCES;
  constructor(public payload: BailVillaDto) { }
}
export class SaveBailVillaActionsError implements Action {
  type: BailVillaActionsTypes =
    BailVillaActionsTypes.SAVE_BAIL_VILLA_ERROR;
  constructor(public payload: string) { }
}

export type BailVillaActions =
  | SaveBailVillaActions
  | SaveBailVillaActionsError
  | SaveBailVillaActionsSuccess
