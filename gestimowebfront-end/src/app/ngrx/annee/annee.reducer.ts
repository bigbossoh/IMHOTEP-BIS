import { Action } from "@ngrx/store";
import { AnneeActionsTypes, AnneeActions } from './annee.actions';

export enum AnneeStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble',
}

export interface AnneeState {
  annees: number[];

  errorMessage: string;
  dataState: AnneeStateEnum;
}
const initState: AnneeState = {
  annees: [],

  errorMessage: '',
  dataState: AnneeStateEnum.INITIAL,
};

export function anneeReducer(
  state: AnneeState = initState,
  action: Action
): AnneeState {
  switch (action.type) {
    // GET ALL APPEL LOYER
    case AnneeActionsTypes.GET_ALL_ANNEE_PERIODE:
      return { ...state, dataState: AnneeStateEnum.LOADING };
    case AnneeActionsTypes.GET_ALL_ANNEE_PERIODE_SUCCES:
      return {
        ...state,
        dataState: AnneeStateEnum.LOADED,
        annees: (<AnneeActions>action).payload,
      };
    case AnneeActionsTypes.GET_ALL_ANNEE_PERIODE_ERROR:
      return {
        ...state,
        dataState: AnneeStateEnum.ERROR,
        errorMessage: (<AnneeActions>action).payload,
      };

    default:
      return { ...state };
  }
}
