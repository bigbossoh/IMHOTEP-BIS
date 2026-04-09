import { Action } from '@ngrx/store';
import { PeriodeDto } from 'src/gs-api/src/models';
import { PeriodeActions, PeriodeActionsTypes } from './periodeappel.actions';


export enum PeriodeStateEnum {
    LOADING = 'Loading',
    LOADED = 'Loaded',
    ERROR = 'Error',
    INITIAL = 'Initial',
    NEW = 'New',
    EDIT = 'Edit',
    LOADEDBYIMMEUNLE = 'LoadedByImmeuble',
}
export interface PeriodeState {

    periodes: PeriodeDto[];
    errorMessage: string;
    dataState: PeriodeStateEnum;
}
const initState: PeriodeState = {

    periodes: [],
    errorMessage: '',
    dataState: PeriodeStateEnum.INITIAL,
};
export function periodeReducer(
    state: PeriodeState = initState,
    action: Action
): PeriodeState {
    switch (action.type) {
        // GET ALL PERIODE BY ANNEE
        case PeriodeActionsTypes.GET_PERIODE_BY_ANNEE:
            return { ...state, dataState: PeriodeStateEnum.LOADING };
        case PeriodeActionsTypes.GET_PERIODE_BY_ANNEE_SUCCES:
            return {
                ...state,
                dataState: PeriodeStateEnum.LOADED,
                periodes: (<PeriodeActions>action).payload,
            };
        case PeriodeActionsTypes.GET_PERIODE_BY_ANNEE_ERROR:
            return {
                ...state,
                dataState: PeriodeStateEnum.ERROR,
                errorMessage: (<PeriodeActions>action).payload,
            };
            // GET ALL PERIODE
            case PeriodeActionsTypes.GET_PERIODE:
              return { ...state, dataState: PeriodeStateEnum.LOADING };
          case PeriodeActionsTypes.GET_PERIODE_SUCCES:
              return {
                  ...state,
                  dataState: PeriodeStateEnum.LOADED,
                  periodes: (<PeriodeActions>action).payload,
              };
          case PeriodeActionsTypes.GET_PERIODE_ERROR:
              return {
                  ...state,
                  dataState: PeriodeStateEnum.ERROR,
                  errorMessage: (<PeriodeActions>action).payload,
              };

        default:
            return { ...state };
    }
}
