import { Action } from '@ngrx/store';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { GerantActionsTypes, GerantActions } from './gerant.actions';

export enum GerantStateEnum {
  LOADING = 'Loading',
  LOADED = 'loaded',
  ERROR = 'error',
  INITIAL = 'initial',
}
export interface GerantState {
  gerants: UtilisateurRequestDto[];
  clienthotel: UtilisateurRequestDto[];
  errorMessage: string;
  dataState: GerantStateEnum;
}
//Etat initiale du stae Gerant
const iniState: GerantState = {
  gerants: [],
  clienthotel:[],
  errorMessage: '',
  dataState: GerantStateEnum.INITIAL,
};
export function gerantReducer(
  state: GerantState = iniState,
  action: Action
): GerantState {
  switch (action.type) {
    case GerantActionsTypes.GET_ALL_GERANTS:
      return { ...state, dataState: GerantStateEnum.LOADING };
    case GerantActionsTypes.GET_ALL_GERANTS_SUCCES:
      return {
        ...state,
        dataState: GerantStateEnum.LOADED,
        gerants: (<GerantActions>action).payload,
      };
    case GerantActionsTypes.GET_ALL_GERANTS_ERROR:
      return {
        ...state,
        dataState: GerantStateEnum.ERROR,
        errorMessage: (<GerantActions>action).payload,
      };

      case GerantActionsTypes.GET_ALL_HOTEL:
        return { ...state, dataState: GerantStateEnum.LOADING };
      case GerantActionsTypes.GET_ALL_HOTEL_SUCCES:
        return {
          ...state,
          dataState: GerantStateEnum.LOADED,
          clienthotel: (<GerantActions>action).payload,
        };
      case GerantActionsTypes.GET_ALL_HOTEL_ERROR:
        return {
          ...state,
          dataState: GerantStateEnum.ERROR,
          errorMessage: (<GerantActions>action).payload,
        };
    default:
      return { ...state };
  }
}
