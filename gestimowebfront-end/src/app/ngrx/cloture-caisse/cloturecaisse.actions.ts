import { Action } from '@ngrx/store';

//STORE
export enum ClotureCaisseActionsTypes {
  //GET ETAGE BY IMMEUBLE
  COUNT_ALL_CLOTURE_INIT = '[ClotureCaisseDto] Count all coture',
  COUNT_ALL_CLOTURE_INIT_SUCCES = '[ClotureCaisseDto] Count all coture SUCCUS',
  COUNT_ALL_CLOTURE_INIT_ERROR = '[ClotureCaisseDto] Count all coture ERROR',

  //GET ETAGE BY IMMEUBLE
  SAVE_CLOTURE_CAISSE = '[ClotureCaisseDto] SAVE coture',
  SAVE_CLOTURE_CAISSE_SUCCES = '[ClotureCaisseDto] SAVE  coture SUCCUS',
  SAVE_CLOTURE_CAISSE_ERROR = '[ClotureCaisseDto] SAVE coture ERROR',

  //GET ETAGE BY IMMEUBLE
  LIST_CLOTURE_CAISSE = '[ClotureCaisseDto] LIST coture',
  LIST_CLOTURE_CAISSE_SUCCES = '[ClotureCaisseDto] LIST  coture SUCCUS',
  LIST_CLOTURE_CAISSE_ERROR = '[ClotureCaisseDto] LIST coture ERROR',
}

export class GetCountInitClotureCaisseActions implements Action {
  type: ClotureCaisseActionsTypes =
    ClotureCaisseActionsTypes.COUNT_ALL_CLOTURE_INIT;
  constructor(public payload: any) {}
}

export class GetCountInitClotureCaisseActionsSuccess implements Action {
  type: ClotureCaisseActionsTypes =
    ClotureCaisseActionsTypes.COUNT_ALL_CLOTURE_INIT_SUCCES;
  constructor(public payload: any) {}
}
export class GetCountInitClotureCaisseActionsError implements Action {
  type: ClotureCaisseActionsTypes =
    ClotureCaisseActionsTypes.COUNT_ALL_CLOTURE_INIT_ERROR;
  constructor(public payload: string) {}
}

export class SaveClotureCaisseActions implements Action {
  type: ClotureCaisseActionsTypes =
    ClotureCaisseActionsTypes.SAVE_CLOTURE_CAISSE;
  constructor(public payload: any) {}
}

export class SaveClotureCaisseActionsSuccess implements Action {
  type: ClotureCaisseActionsTypes =
    ClotureCaisseActionsTypes.SAVE_CLOTURE_CAISSE_SUCCES;
  constructor(public payload: any) {}
}
export class SaveClotureCaisseActionsError implements Action {
  type: ClotureCaisseActionsTypes =
    ClotureCaisseActionsTypes.SAVE_CLOTURE_CAISSE_ERROR;
  constructor(public payload: string) {}
}

export class ListClotureCaisseActions implements Action {
  type: ClotureCaisseActionsTypes =
    ClotureCaisseActionsTypes.LIST_CLOTURE_CAISSE;
  constructor(public payload: any) {}
}

export class ListClotureCaisseActionsSuccess implements Action {
  type: ClotureCaisseActionsTypes =
    ClotureCaisseActionsTypes.LIST_CLOTURE_CAISSE_SUCCES;
  constructor(public payload: any) {}
}
export class ListClotureCaisseActionsError implements Action {
  type: ClotureCaisseActionsTypes =
    ClotureCaisseActionsTypes.LIST_CLOTURE_CAISSE_ERROR;
  constructor(public payload: string) {}
}

export type ClotureCaisseActions =
  | GetCountInitClotureCaisseActions
  | GetCountInitClotureCaisseActionsSuccess
  | GetCountInitClotureCaisseActionsError
  | SaveClotureCaisseActions
  | SaveClotureCaisseActionsError
  | SaveClotureCaisseActionsSuccess
  | ListClotureCaisseActions
  | ListClotureCaisseActionsError
  | ListClotureCaisseActionsSuccess;
