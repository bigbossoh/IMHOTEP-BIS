import { Action } from '@ngrx/store';

export enum AnneeActionsTypes {
  GET_ALL_ANNEE_PERIODE = 'Get All  Année',
  GET_ALL_ANNEE_PERIODE_SUCCES = 'Get All  Années Succes',
  GET_ALL_ANNEE_PERIODE_ERROR = 'Get All  AnnéEtagesState Error',
}

// GET ALL APPEL LOYER
export class GetAllAnneeActions implements Action {
  type: AnneeActionsTypes = AnneeActionsTypes.GET_ALL_ANNEE_PERIODE;
  constructor(public payload: any) {}
}

export class GetAllAnneeActionsSuccess implements Action {
  type: AnneeActionsTypes = AnneeActionsTypes.GET_ALL_ANNEE_PERIODE_SUCCES;
  constructor(public payload: number[]) {}
}
export class GetAllAnneeActionsError implements Action {
  type: AnneeActionsTypes = AnneeActionsTypes.GET_ALL_ANNEE_PERIODE_ERROR;
  constructor(public payload: string) {}
}

export type AnneeActions =
  | GetAllAnneeActions
  | GetAllAnneeActionsSuccess
  | GetAllAnneeActionsError;
