
import { Action } from '@ngrx/store';
import { VilleDto } from 'src/gs-api/src/models';
import {
  VillesActions,
  VillesActionsTypes,
} from './ville.actions';
export enum VilleStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble'

}
export interface VilleState {
  villes: VilleDto[];
  errorMessage: string;
  dataState: VilleStateEnum;
}
const initState: VilleState = {
  villes: [],
  errorMessage: '',
  dataState: VilleStateEnum.INITIAL,
};
export function villeReducer(
  state: VilleState = initState,
  action: Action
): VilleState {
  switch (action.type) {

    case VillesActionsTypes.GET_ALL_VILLES:
      return { ...state, dataState: VilleStateEnum.LOADING };
    case VillesActionsTypes.GET_ALL_VILLES_SUCCES:
      return {
        ...state,
        dataState: VilleStateEnum.LOADED,
        villes: (<VillesActions>action).payload,
      };
    case VillesActionsTypes.GET_ALL_VILLES_ERROR:
      return {
        ...state,
        dataState: VilleStateEnum.ERROR,
        errorMessage: (<VillesActions>action).payload,
      };
    default:
      return { ...state };
  }
}
