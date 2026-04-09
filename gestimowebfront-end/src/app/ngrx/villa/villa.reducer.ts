import { Action } from '@ngrx/store';
import {
  VillaDto,
} from 'src/gs-api/src/models';
import { VillaActions, VillaActionsTypes } from './villa.action';
export enum VillaStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble',
}
export interface VillaState {
  villas: VillaDto[];
  villa:any;
  errorMessage: string;
  dataState: VillaStateEnum;
}
const initState: VillaState = {
  villas: [],
  villa:null,
  errorMessage: '',
  dataState: VillaStateEnum.INITIAL,
};
export function villaReducer(
  state: VillaState = initState,
  action: Action
): VillaState {
  switch (action.type) {
    //SAVE ETAGE
    case VillaActionsTypes.SAVE_VILLA:
      return { ...state, dataState: VillaStateEnum.LOADING };
    case VillaActionsTypes.SAVE_VILLA_SUCCES:
      let vill: VillaDto[] = [...state.villas];
      vill.push((<VillaActions>action).payload);
      return {
        ...state,
        dataState: VillaStateEnum.LOADED,
        villas: vill,
      };
    case VillaActionsTypes.SAVE_VILLA_ERROR:
      return {
        ...state,
        dataState: VillaStateEnum.ERROR,
        errorMessage: (<VillaActions>action).payload,
      };
    //GET VILLA BY ID 
    case VillaActionsTypes.GET_VILLA_BY_ID:
      return { ...state, dataState: VillaStateEnum.LOADING };
    case VillaActionsTypes.GET_VILLA_BY_ID_SUCCES:
       return {
        ...state,
        dataState: VillaStateEnum.LOADED,
        villa: (<VillaActions>action).payload,
      };
    case VillaActionsTypes.GET_VILLA_BY_ID_ERROR:
      return {
        ...state,
        dataState: VillaStateEnum.ERROR,
        errorMessage: (<VillaActions>action).payload,
      };

      // GET ALL VILLA LIBRES
    case VillaActionsTypes.GET_ALL_VILLA_LIBRE:
      return { ...state, dataState: VillaStateEnum.LOADING };
    case VillaActionsTypes.GET_ALL_VILLA_LIBRE_SUCCES:
      return {
        ...state,
        dataState: VillaStateEnum.LOADED,
        villas: (<VillaActions>action).payload,
      };
    case VillaActionsTypes.GET_ALL_VILLA_LIBRE_ERROR:
      return {
        ...state,
        dataState: VillaStateEnum.ERROR,
        errorMessage: (<VillaActions>action).payload,
      };

       // GET ALL VILLA
       case VillaActionsTypes.GET_ALL_VILLA:
        return { ...state, dataState: VillaStateEnum.LOADING };
      case VillaActionsTypes.GET_ALL_VILLA_SUCCES:
        return {
          ...state,
          dataState: VillaStateEnum.LOADED,
          villas: (<VillaActions>action).payload,
        };
      case VillaActionsTypes.GET_ALL_VILLA_ERROR:
        return {
          ...state,
          dataState: VillaStateEnum.ERROR,
          errorMessage: (<VillaActions>action).payload,
        };
    default:
      return { ...state };
  }
}
