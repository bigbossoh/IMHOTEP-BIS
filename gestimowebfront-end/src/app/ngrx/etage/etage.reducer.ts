import { Action } from '@ngrx/store';
import { EtageAfficheDto, EtageDto } from 'src/gs-api/src/models';
import {
  EtagesActions,
  EtagesActionsTypes,
} from './etage.actions';
export enum EtagesStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble'

}
export interface EtagesState {
  etages: EtageAfficheDto[];
  errorMessage: string;
  dataState: EtagesStateEnum;
}
const initState: EtagesState = {
  etages: [],
  errorMessage: '',
  dataState: EtagesStateEnum.INITIAL,
};
export function etageByImmeubeReducer(
  state: EtagesState = initState,
  action: Action
): EtagesState {
  switch (action.type) {

    //GET ALL ETAGES
    case EtagesActionsTypes.GET_ALL_ETAGES:
      return { ...state, dataState: EtagesStateEnum.LOADING };
    case EtagesActionsTypes.GET_ALL_ETAGES_SUCCES:
      return {
        ...state,
        dataState: EtagesStateEnum.LOADED,
        etages: (<EtagesActions>action).payload,
      };
    case EtagesActionsTypes.GET_ALL_ETAGES_ERROR:
      return {
        ...state,
        dataState: EtagesStateEnum.ERROR,
        errorMessage: (<EtagesActions>action).payload,
      };

    //FIND ETAGE BY IMMEUBLE
    case EtagesActionsTypes.GET_ALL_ETAGES_BY_IMMEUBLE:
      return { ...state, dataState: EtagesStateEnum.LOADEDBYIMMEUNLE, etages: (<EtagesActions>action).payload, };
    case EtagesActionsTypes.GET_ALL_ETAGES_BY_IMMEUBLE_SUCCES:
      return {
        ...state,
        dataState: EtagesStateEnum.LOADED,
        etages: (<EtagesActions>action).payload,
      };
    case EtagesActionsTypes.GET_ALL_ETAGES_BY_IMMEUBLE_ERROR:
      return {
        ...state,
        dataState: EtagesStateEnum.ERROR,
        errorMessage: (<EtagesActions>action).payload,
      };
    //SAVE ETAGE
    case EtagesActionsTypes.SAVE_ETAGE:
      return { ...state, dataState: EtagesStateEnum.LOADING };
    case EtagesActionsTypes.SAVE_ETAGE_SUCCES:
      let etgs: EtageDto[] = [...state.etages];
      etgs.push((<EtagesActions>action).payload)
      return {
        ...state,
        dataState: EtagesStateEnum.LOADED,
        etages: etgs
      };
    case EtagesActionsTypes.SAVE_ETAGE_ERROR:
      return {
        ...state,
        dataState: EtagesStateEnum.ERROR,
        errorMessage: (<EtagesActions>action).payload,
      };
    default:
      return { ...state };
  }
}
