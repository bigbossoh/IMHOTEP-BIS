import { Action } from '@ngrx/store';
import { BienImmobilierAffiheDto } from '../../../gs-api/src/models/bien-immobilier-affihe-dto';

import {
  BienImmobilierActions,
  BienImmobilierActionsTypes,
} from './bienimmobilier.actions';
export enum BienImmobilierStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = "New"
}
export interface BienImmobilierState {
  bienImmoblilier: BienImmobilierAffiheDto[];
  errorMessage: string;
  dataState: BienImmobilierStateEnum;
}
const initState: BienImmobilierState = {
  bienImmoblilier: [],
  errorMessage: '',
  dataState: BienImmobilierStateEnum.INITIAL,
};
export function bienReducer(
  state: BienImmobilierState = initState,
  action: Action
): BienImmobilierState {
  switch (action.type) {
    /** GET ALL BIENS IMMOBILIERS */
    case BienImmobilierActionsTypes.GET_ALL_BIENS:
      return { ...state, dataState: BienImmobilierStateEnum.LOADING };
    case BienImmobilierActionsTypes.GET_ALL_BIENS_SUCCES:
      return {
        ...state,
        dataState: BienImmobilierStateEnum.LOADED,
        bienImmoblilier: (<BienImmobilierActions>action).payload,
      };
    case BienImmobilierActionsTypes.GET_ALL_BIENS_ERROR:
      return {
        ...state,
        dataState: BienImmobilierStateEnum.ERROR,
        errorMessage: (<BienImmobilierActions>action).payload,
      };

    /** NEW BIEN IMMOBILIER */
    case BienImmobilierActionsTypes.NEW_BIENS:
      return { ...state, dataState: BienImmobilierStateEnum.NEW };
    case BienImmobilierActionsTypes.NEW_BIENS_SUCCES:
      return {
        ...state,
        dataState: BienImmobilierStateEnum.LOADED,
        bienImmoblilier: (<BienImmobilierActions>action).payload,
      };
    case BienImmobilierActionsTypes.NEW_BIENS_ERROR:
      return {
        ...state,
        dataState: BienImmobilierStateEnum.ERROR,
        errorMessage: (<BienImmobilierActions>action).payload,
      };

     /** NEW BIEN IMMOBILIER */
     case BienImmobilierActionsTypes.RATTACHER_BIEN_CHAPITRE:
      return { ...state, dataState: BienImmobilierStateEnum.NEW };
    case BienImmobilierActionsTypes.RATTACHER_BIEN_CHAPITRE_BIENS_SUCCES:
      return {
        ...state,
        dataState: BienImmobilierStateEnum.LOADED,
        bienImmoblilier: (<BienImmobilierActions>action).payload,
      };
    case BienImmobilierActionsTypes.RATTACHER_BIEN_CHAPITRE_BIENS_ERROR:
      return {
        ...state,
        dataState: BienImmobilierStateEnum.ERROR,
        errorMessage: (<BienImmobilierActions>action).payload,
      };
    default:
      return { ...state };
  }
}
