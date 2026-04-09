import { Action } from '@ngrx/store';
import { ImmeubleDto, ImmeubleEtageDto } from 'src/gs-api/src/models';

import {
  ImmeublesActions,
  ImmeublesActionsTypes,
} from './immeuble.actions';
export enum ImmeubleStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
}
export interface ImmeubleState {
  immeubles: ImmeubleEtageDto[];
  errorMessage: string;
  dataState: ImmeubleStateEnum;
}
const initState: ImmeubleState = {
  immeubles: [],
  errorMessage: '',
  dataState: ImmeubleStateEnum.INITIAL,
};
export function immeubleReducer(
  state: ImmeubleState = initState,
  action: Action
): ImmeubleState {
  switch (action.type) {
    case ImmeublesActionsTypes.GET_ALL_IMMEUBLES:
      return { ...state, dataState: ImmeubleStateEnum.LOADING };
    case ImmeublesActionsTypes.GET_ALL_IMMEUBLES_SUCCES:
      return {
        ...state,
        dataState: ImmeubleStateEnum.LOADED,
        immeubles: (<ImmeublesActions>action).payload,
      };
    case ImmeublesActionsTypes.GET_ALL_IMMEUBLES_ERROR:
      return {
        ...state,
        dataState: ImmeubleStateEnum.ERROR,
        errorMessage: (<ImmeublesActions>action).payload,
      };
    //SAVE IMMEUBLE
    case ImmeublesActionsTypes.SAVE_IMMEUBLES:
      return { ...state, dataState: ImmeubleStateEnum.LOADING };
    case ImmeublesActionsTypes.SAVE_IMMEUBLES_SUCCES:
      let imm: ImmeubleEtageDto[] = [...state.immeubles];
      imm.push((<ImmeublesActions>action).payload)
      return {
        ...state,
        dataState: ImmeubleStateEnum.LOADED,
        immeubles: imm
      };
    case ImmeublesActionsTypes.SAVE_IMMEUBLES_ERROR:
      return {
        ...state,
        dataState: ImmeubleStateEnum.ERROR,
        errorMessage: (<ImmeublesActions>action).payload,
      };
    default:
      return { ...state };
  }
}
