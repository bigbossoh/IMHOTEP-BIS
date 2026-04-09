import { OperationDto } from './../../../gs-api/src/models/operation-dto';
import { Action } from '@ngrx/store';
import { BailMagasinDto } from 'src/gs-api/src/models';
import {
  BailMagasinActions,
  BailMagasinActionsTypes,
} from './bailmagasin.actions';
export enum BailMagasinStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',


}
export interface BailMagasinState {
  bailmagasins: OperationDto[];
  errorMessage: string;
  dataState: BailMagasinStateEnum;
}
const initState: BailMagasinState = {
  bailmagasins: [],
  errorMessage: '',
  dataState: BailMagasinStateEnum.INITIAL,
};
export function bailMagasinReducer(
  state: BailMagasinState = initState,
  action: Action
): BailMagasinState {
  switch (action.type) {

    //SAVE ETAGE
    case BailMagasinActionsTypes.SAVE_BAIL_MAGASIN:
      return { ...state, dataState: BailMagasinStateEnum.LOADING };
    case BailMagasinActionsTypes.SAVE_BAIL_MAGASIN_SUCCES:
      let magas: OperationDto[] = [...state.bailmagasins];
      magas.push((<BailMagasinActions>action).payload)
      return {
        ...state,
        dataState: BailMagasinStateEnum.LOADED,
        bailmagasins: magas
      };
    case BailMagasinActionsTypes.SAVE_BAIL_MAGASIN_ERROR:
      return {
        ...state,
        dataState: BailMagasinStateEnum.ERROR,
        errorMessage: (<BailMagasinActions>action).payload,
      };
    default:
      return { ...state };
  }
}
