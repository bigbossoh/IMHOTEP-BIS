import { Action } from "@ngrx/store";

export enum EtablissementActionsTypes {
  GET_ETAB_DEFAULT_NAME= '[EtageDto] Get All DEFAULT NAME',
  GET_ETAB_DEFAULT_NAME_SUCCES = '[EtageDto] Get All Etage Succes',
  GET_ETAB_DEFAULT_NAME_ERROR = '[EtageDto] Get All Etage Error',
}


export class GetDefaultEtabNameActions implements Action {
  type: EtablissementActionsTypes = EtablissementActionsTypes.GET_ETAB_DEFAULT_NAME;
  constructor(public payload: any) { }
}

export class GetDefaultEtabNameActionsSuccess implements Action {
  type: EtablissementActionsTypes =
  EtablissementActionsTypes.GET_ETAB_DEFAULT_NAME_SUCCES;
  constructor(public payload: any) { }
}
export class GetDefaultEtabNameActionsError implements Action {
  type: EtablissementActionsTypes =
  EtablissementActionsTypes.GET_ETAB_DEFAULT_NAME_ERROR;
  constructor(public payload: string) { }
}
export type EtablissementsActions =
  | GetDefaultEtabNameActions
  | GetDefaultEtabNameActionsSuccess
  | GetDefaultEtabNameActionsError;
