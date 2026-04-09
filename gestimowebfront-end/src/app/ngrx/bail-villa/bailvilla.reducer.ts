import { OperationDto } from './../../../gs-api/src/models/operation-dto';
import { Action } from '@ngrx/store';
import {
  BailVillaActions,
  BailVillaActionsTypes,
} from './bailvilla.actions';
export enum BailVillaStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',


}
export interface BailVillaState {
  bailvillas: OperationDto[];
  errorMessage: string;
  dataState: BailVillaStateEnum;
}
const initState: BailVillaState = {
  bailvillas: [],
  errorMessage: '',
  dataState: BailVillaStateEnum.INITIAL,
};
export function bailvillaReducer(
  state: BailVillaState = initState,
  action: Action
): BailVillaState {
  switch (action.type) {

    //SAVE ETAGE
    case BailVillaActionsTypes.SAVE_BAIL_VILLA:
      return { ...state, dataState: BailVillaStateEnum.LOADING };
    case BailVillaActionsTypes.SAVE_BAIL_VILLA_SUCCES:
     let bvilla: OperationDto[] = [...state.bailvillas];
     bvilla.push((<BailVillaActions>action).payload)
      return {
        ...state,
        dataState: BailVillaStateEnum.LOADED,
       bailvillas: bvilla
      };
    case BailVillaActionsTypes.SAVE_BAIL_VILLA_ERROR:
      return {
        ...state,
        dataState: BailVillaStateEnum.ERROR,
        errorMessage: (<BailVillaActions>action).payload,
      };
    default:
      return { ...state };
  }
}
