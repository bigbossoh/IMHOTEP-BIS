import { Action } from '@ngrx/store';
import { CommuneRequestDto } from 'src/gs-api/src/models';
import { QuartierResponseDto } from '../../../gs-api/src/models/quartier-response-dto';
import {
  QuartierActions,
  QuartierActionsTypes,
} from './quartier.actions';
export enum QuartierStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble'

}
export interface QuartiersState {
  quartiers: QuartierResponseDto[];
  errorMessage: string;
  dataState: QuartierStateEnum;
}
const initState: QuartiersState = {
  quartiers: [],
  errorMessage: '',
  dataState: QuartierStateEnum.INITIAL,
};
export function quartierReducer(
  state: QuartiersState = initState,
  action: Action
): QuartiersState {
  switch (action.type) {
    case QuartierActionsTypes.GET_ALL_QUARTIER_BY_COMMUNE:
      return { ...state, dataState: QuartierStateEnum.LOADING };
    case QuartierActionsTypes.GET_ALL_QUARTIER_BY_COMMUNE_SUCCES:
      return {
        ...state,
        dataState: QuartierStateEnum.LOADED,
        quartiers: (<QuartierActions>action).payload,
      };
    case QuartierActionsTypes.GET_ALL_QUARTIER_BY_COMMUNE_SUCCES:
      return {
        ...state,
        dataState: QuartierStateEnum.ERROR,
        errorMessage: (<QuartierActions>action).payload,
      };

    default:
      return { ...state };
  }
}
