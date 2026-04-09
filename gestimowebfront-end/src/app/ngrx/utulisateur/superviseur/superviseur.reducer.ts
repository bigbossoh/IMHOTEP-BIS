import { Action } from "@ngrx/store";
import { UtilisateurRequestDto } from "src/gs-api/src/models";
import { SuperviseurAction, superviseurActionType } from "./superviseur.action";



export enum SuperviseurStateEnum {
  LOADING = 'Loading',
  LOADED = 'loaded',
  ERROR = 'error',
  INITIAL = 'initial',
}
export interface SuperviseurState {
  superviseurs: UtilisateurRequestDto[];
  errorMessage: string;
  dataState: SuperviseurStateEnum;
}
//Etat initiale du stae Gerant
const iniState: SuperviseurState = {
  superviseurs: [],
  errorMessage: '',
  dataState: SuperviseurStateEnum.INITIAL,
};

export function superviseurReducer(
  state: SuperviseurState = iniState,
  action: Action
): SuperviseurState {
  switch (action.type) {
    case superviseurActionType.GET_ALL_SUPERVISEUR:
      return { ...state, dataState: SuperviseurStateEnum.LOADING };
    case superviseurActionType.GET_ALL_SUPERVISEUR_SUCCESS:
      return {
        ...state,
        dataState: SuperviseurStateEnum.LOADED,
        superviseurs: (<SuperviseurAction>action).payload,
      };
    case superviseurActionType.GET_ALL_SUPERVISEUR_ERROR:
      return {
        ...state,
        dataState: SuperviseurStateEnum.ERROR,
        errorMessage: (<SuperviseurAction>action).payload,
      };
    default:
      return { ...state };
  }
}
