import { Action } from '@ngrx/store';
import { CommuneRequestDto } from 'src/gs-api/src/models';
import {
  CommunesActions,
  CommunesActionsTypes,
} from './commune.actions';
export enum CommunesStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble'

}
export interface CommunesState {
  communes: CommuneRequestDto[];
  errorMessage: string;
  dataState: CommunesStateEnum;
}
const initState: CommunesState = {
  communes: [],
  errorMessage: '',
  dataState: CommunesStateEnum.INITIAL,
};
export function communeReducer(
  state: CommunesState = initState,
  action: Action
): CommunesState {
  switch (action.type) {
    case CommunesActionsTypes.GET_ALL_COMMUNE_BY_VILLE:
      return { ...state, dataState: CommunesStateEnum.LOADING };
    case CommunesActionsTypes.GET_ALL_COMMUNE_BY_VILLE_SUCCES:
      return {
        ...state,
        dataState: CommunesStateEnum.LOADED,
        communes: (<CommunesActions>action).payload,
      };
    case CommunesActionsTypes.GET_ALL_COMMUNE_BY_VILLE_ERROR:
      return {
        ...state,
        dataState: CommunesStateEnum.ERROR,
        errorMessage: (<CommunesActions>action).payload,
      };


    default:
      return { ...state };
  }
}
