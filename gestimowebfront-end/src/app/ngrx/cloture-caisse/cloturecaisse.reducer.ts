import { Action } from '@ngrx/store';
import {
  ClotureCaisseActions,
  ClotureCaisseActionsTypes,
} from './cloturecaisse.actions';

export enum ClotureCaisseStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble',
}
export interface ClotureCaisseState {
  listClotureCaisse: any;
  saveClotureCaisse: any;
  countClotureCaisseInit: any;
  errorMessage: string;
  dataState: ClotureCaisseStateEnum;
}
const initState: ClotureCaisseState = {
  listClotureCaisse: null,
  saveClotureCaisse: false,
  countClotureCaisseInit: 0,
  errorMessage: '',
  dataState: ClotureCaisseStateEnum.INITIAL,
};
export function ClotureCaisseReducer(
  state: ClotureCaisseState = initState,
  action: Action
): ClotureCaisseState {
  switch (action.type) {
    case ClotureCaisseActionsTypes.COUNT_ALL_CLOTURE_INIT:
      return { ...state, dataState: ClotureCaisseStateEnum.LOADING };
    case ClotureCaisseActionsTypes.COUNT_ALL_CLOTURE_INIT_SUCCES:
      return {
        ...state,
        dataState: ClotureCaisseStateEnum.LOADED,
        countClotureCaisseInit: (<ClotureCaisseActions>action).payload,
      };
    case ClotureCaisseActionsTypes.COUNT_ALL_CLOTURE_INIT_ERROR:
      return {
        ...state,
        dataState: ClotureCaisseStateEnum.ERROR,
        errorMessage: (<ClotureCaisseActions>action).payload,
      };

    case ClotureCaisseActionsTypes.SAVE_CLOTURE_CAISSE:
      return { ...state, dataState: ClotureCaisseStateEnum.LOADING };
    case ClotureCaisseActionsTypes.SAVE_CLOTURE_CAISSE_SUCCES:
      return {
        ...state,
        dataState: ClotureCaisseStateEnum.LOADED,
        saveClotureCaisse: (<ClotureCaisseActions>action).payload,
      };
    case ClotureCaisseActionsTypes.SAVE_CLOTURE_CAISSE_ERROR:
      return {
        ...state,
        dataState: ClotureCaisseStateEnum.ERROR,
        errorMessage: (<ClotureCaisseActions>action).payload,
      };

    case ClotureCaisseActionsTypes.LIST_CLOTURE_CAISSE:
      return { ...state, dataState: ClotureCaisseStateEnum.LOADING };
    case ClotureCaisseActionsTypes.LIST_CLOTURE_CAISSE_SUCCES:
      return {
        ...state,
        dataState: ClotureCaisseStateEnum.LOADED,
        listClotureCaisse: (<ClotureCaisseActions>action).payload,
      };
    case ClotureCaisseActionsTypes.LIST_CLOTURE_CAISSE_ERROR:
      return {
        ...state,
        dataState: ClotureCaisseStateEnum.ERROR,
        errorMessage: (<ClotureCaisseActions>action).payload,
      };

    default:
      return { ...state };
  }
}
