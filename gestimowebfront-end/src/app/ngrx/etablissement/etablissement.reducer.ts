import { Action } from '@ngrx/store';
import { EtageAfficheDto, EtageDto } from 'src/gs-api/src/models';
import { EtablissementActionsTypes, EtablissementsActions } from './etablisement.action';

export enum EtablissementStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble'

}
export interface EtablissementState {
  etabname: any;
  errorMessage: string;
  dataState: EtablissementStateEnum;
}
const initState: EtablissementState = {
  etabname: [],
  errorMessage: '',
  dataState: EtablissementStateEnum.INITIAL,
};
export function EtablissementReducer(
  state: EtablissementState = initState,
  action: Action
): EtablissementState {
  switch (action.type) {

    //GET ALL ETAGES
    case EtablissementActionsTypes.GET_ETAB_DEFAULT_NAME:
      return { ...state, dataState: EtablissementStateEnum.LOADING };
    case EtablissementActionsTypes.GET_ETAB_DEFAULT_NAME_SUCCES:
      return {
        ...state,
        dataState: EtablissementStateEnum.LOADED,
        etabname: (<EtablissementsActions>action).payload,
      };
    case EtablissementActionsTypes.GET_ETAB_DEFAULT_NAME_ERROR:
      return {
        ...state,
        dataState: EtablissementStateEnum.ERROR,
        errorMessage: (<EtablissementsActions>action).payload,
      };

    default:
      return { ...state };
  }
}
