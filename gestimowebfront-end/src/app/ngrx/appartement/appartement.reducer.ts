import { Action } from '@ngrx/store';
import {
  AppartementDto,

} from 'src/gs-api/src/models';
import {
  AppartementActions,
  AppartementctionsTypes,
} from './appartement.actions';
export enum AppartementStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble',
}
export interface AppartementState {
  appa:any;
  appartements: AppartementDto[];
  appartementsCatego: AppartementDto[];
  appartement: any;
  errorMessage: string;
  dataState: AppartementStateEnum;
}
const initState: AppartementState = {
  appa:null,
  appartements: [],
  appartementsCatego:[],
  errorMessage: '',
  appartement: null,
  dataState: AppartementStateEnum.INITIAL,
};
export function appartementReducer(
  state: AppartementState = initState,
  action: Action
): AppartementState {
  switch (action.type) {
    //SAVE APPARTEMENT
    case AppartementctionsTypes.SAVE_APPARTEMENT:
      return { ...state, dataState: AppartementStateEnum.LOADING };
    case AppartementctionsTypes.SAVE_APPARTEMENT_SUCCES:
      let appart: AppartementDto[] = [...state.appartements];
      appart.push((<AppartementActions>action).payload);
      return {
        ...state,
        dataState: AppartementStateEnum.LOADED,
        appartements: appart,
      };
    case AppartementctionsTypes.SAVE_APPARTEMENT_ERROR:
      return {
        ...state,
        dataState: AppartementStateEnum.ERROR,
        errorMessage: (<AppartementActions>action).payload,
      };
    //FIND UN APPARTEMENT PAR L'ID
    case AppartementctionsTypes.GET_APPARTEMENT_BY_ID:
      return { ...state, dataState: AppartementStateEnum.LOADING };
    case AppartementctionsTypes.GET_APPARTEMENT_BY_ID_SUCCES:
      return {
        ...state,
        dataState: AppartementStateEnum.LOADED,
        appartement: (<AppartementActions>action).payload,
      };
    case AppartementctionsTypes.GET_APPARTEMENT_BY_ID_ERROR:
      return {
        ...state,
        dataState: AppartementStateEnum.ERROR,
        errorMessage: (<AppartementActions>action).payload,
      };

    // GET ALL APPARTEMENT LIBRE
    case AppartementctionsTypes.GET_ALL_APPARTEMENT_LIBRE:
      return { ...state, dataState: AppartementStateEnum.LOADING };
    case AppartementctionsTypes.GET_ALL_APPARTEMENT_LIBRE_SUCCES:
      return {
        ...state,
        dataState: AppartementStateEnum.LOADED,
        appartements: (<AppartementActions>action).payload,
      };
    case AppartementctionsTypes.GET_ALL_APPARTEMENT_LIBRE_ERROR:
      return {
        ...state,
        dataState: AppartementStateEnum.ERROR,
        errorMessage: (<AppartementActions>action).payload,
      };

    // GET ALL APPARTEMENT
    case AppartementctionsTypes.GET_ALL_APPARTEMENT:
      return { ...state, dataState: AppartementStateEnum.LOADING };
    case AppartementctionsTypes.GET_ALL_APPARTEMENT_SUCCES:
      return {
        ...state,
        dataState: AppartementStateEnum.LOADED,
        appartements: (<AppartementActions>action).payload,
      };
    case AppartementctionsTypes.GET_ALL_APPARTEMENT_ERROR:
      return {
        ...state,
        dataState: AppartementStateEnum.ERROR,
        errorMessage: (<AppartementActions>action).payload,
      };

        // GET ALL APPARTEMENT
    case AppartementctionsTypes.GET_ALL_APPARTEMENT_MEUBLE:
      return { ...state, dataState: AppartementStateEnum.LOADING };
    case AppartementctionsTypes.GET_ALL_APPARTEMENT_MEUBLE_SUCCES:
      return {
        ...state,
        dataState: AppartementStateEnum.LOADED,
        appartements: (<AppartementActions>action).payload,
      };
    case AppartementctionsTypes.GET_ALL_APPARTEMENT_MEUBLE_ERROR:
      return {
        ...state,
        dataState: AppartementStateEnum.ERROR,
        errorMessage: (<AppartementActions>action).payload,
      };

           // GET ALL APPARTEMENT
    case AppartementctionsTypes.GET_ALL_APPARTEMENT_MEUBLE_PAR_CATEGORIE:
      return { ...state, dataState: AppartementStateEnum.LOADING };
    case AppartementctionsTypes.GET_ALL_APPARTEMENT_MEUBLE_PAR_CATEGORIE_SUCCES:
      return {
        ...state,
        dataState: AppartementStateEnum.LOADED,
        appartementsCatego: (<AppartementActions>action).payload,
      };
    case AppartementctionsTypes.GET_ALL_APPARTEMENT_MEUBLE_PAR_CATEGORIE_ERROR:
      return {
        ...state,
        dataState: AppartementStateEnum.ERROR,
        errorMessage: (<AppartementActions>action).payload,
      };
        //SAVE APPARTEMENT
    case AppartementctionsTypes.SAVE_APPARTEMENT_CATE:
      return { ...state, dataState: AppartementStateEnum.LOADING };
    case AppartementctionsTypes.SAVE_APPARTEMENT_CATE_SUCCES:

      return {
        ...state,
        dataState: AppartementStateEnum.LOADED,
        appartements: (<AppartementActions>action).payload,
      };
    case AppartementctionsTypes.SAVE_APPARTEMENT_CATE_ERROR:
      return {
        ...state,
        dataState: AppartementStateEnum.ERROR,
        errorMessage: (<AppartementActions>action).payload,
      };
    default:
      return { ...state };
  }
}
