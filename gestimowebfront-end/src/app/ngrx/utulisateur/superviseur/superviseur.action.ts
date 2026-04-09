import { Action } from "@ngrx/store";
import { UtilisateurRequestDto } from "src/gs-api/src/models";


export enum superviseurActionType{
  GET_ALL_SUPERVISEUR='[UtilisateurRequestDto] get all superviseurs',
  GET_ALL_SUPERVISEUR_SUCCESS='[UtilisateurRequestDto] get all superviseurs success',
  GET_ALL_SUPERVISEUR_ERROR='[UtilisateurRequestDto] get all superviseurs error',
}
export class getAllSuperviseurAction implements Action{
  type: superviseurActionType=superviseurActionType.GET_ALL_SUPERVISEUR;
  constructor(public payload: any){}
}
export class getAllSuperviseurActionSuccess implements Action{
  type: superviseurActionType=superviseurActionType.GET_ALL_SUPERVISEUR_SUCCESS;
  constructor(public payload: UtilisateurRequestDto[]){}
}
export class getAllSuperviseurActionError implements Action{
  type: superviseurActionType=superviseurActionType.GET_ALL_SUPERVISEUR_ERROR;
  constructor(public payload: String){}
}
export type SuperviseurAction=
  | getAllSuperviseurActionError
  | getAllSuperviseurActionSuccess
  | getAllSuperviseurAction


