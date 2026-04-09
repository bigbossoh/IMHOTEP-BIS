import { OperationDto } from './../../../gs-api/src/models/operation-dto';
import { Action } from '@ngrx/store';
import { BailAppartementDto } from 'src/gs-api/src/models';
import {
  BailAppartementnActions,
  BailAppartementActionsTypes,
} from './bailappartement.actions';
export enum BailAppartementStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',


}
export interface BailAppartementState {
  bailappartement: OperationDto[];
  errorMessage: string;
  dataState: BailAppartementStateEnum;
}
const initState: BailAppartementState = {
  bailappartement: [],
  errorMessage: '',
  dataState: BailAppartementStateEnum.INITIAL,
};
export function bailAppartementReducer(
  state: BailAppartementState = initState,
  action: Action
): BailAppartementState {
  switch (action.type) {

    //SAVE ETAGE
    case BailAppartementActionsTypes.SAVE_BAIL_APPARTEMENT:
      return { ...state, dataState: BailAppartementStateEnum.LOADING };
    case BailAppartementActionsTypes.SAVE_BAIL_APPARTEMENT_SUCCES:
      let appa: OperationDto[] = [...state.bailappartement];
      appa.push((<BailAppartementnActions>action).payload)
      return {
        ...state,
        dataState: BailAppartementStateEnum.LOADED,
        bailappartement: appa
      };
    case BailAppartementActionsTypes.SAVE_BAIL_APPARTEMENT_ERROR:
      return {
        ...state,
        dataState: BailAppartementStateEnum.ERROR,
        errorMessage: (<BailAppartementnActions>action).payload,
      };
    default:
      return { ...state };
  }
}
