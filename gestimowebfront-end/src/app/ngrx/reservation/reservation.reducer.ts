import { state } from '@angular/animations';
import { Action } from '@ngrx/store';
import {
  ReservationActions,
  ReservationActionTypes,
} from './reservation.actions';
export enum ReservationStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble',
}

export interface ReservationState {
  reservations: any;
  encaissementbiens:any;
  reservationouverts: any;
  encaissementreservation:any;
  savereservations: any;
  errorMessage: string;
  dataState: ReservationStateEnum;
}
const initState: ReservationState = {
  encaissementreservation:null,
  reservations: null,
  encaissementbiens:null,
  reservationouverts: null,
  dataState: ReservationStateEnum.INITIAL,
  errorMessage: '',
  savereservations: null,
};
export function reservationReducer(
  state: ReservationState = initState,
  action: Action
): ReservationState {
  switch (action.type) {
    case ReservationActionTypes.GET_LISTE_RESERVATION_OUVERT:
      return { ...state, dataState: ReservationStateEnum.LOADING };
    case ReservationActionTypes.GET_LISTE_RESERVATION_OUVERT_SUCCES:
      return {
        ...state,
        dataState: ReservationStateEnum.LOADED,
        reservationouverts: (<ReservationActions>action).payload,
      };
    case ReservationActionTypes.GET_LISTE_RESERVATION_OUVERT_ERROR:
      return {
        ...state,
        dataState: ReservationStateEnum.ERROR,
        errorMessage: (<ReservationActions>action).payload,
      };

    case ReservationActionTypes.GET_LISTE_RESERVATION:
      return { ...state, dataState: ReservationStateEnum.LOADING };
    case ReservationActionTypes.GET_LISTE_RESERVATION_SUCCES:
      return {
        ...state,
        dataState: ReservationStateEnum.LOADED,
        reservations: (<ReservationActions>action).payload,
      };
    case ReservationActionTypes.GET_LISTE_RESERVATION_ERROR:
      return {
        ...state,
        dataState: ReservationStateEnum.ERROR,
        errorMessage: (<ReservationActions>action).payload,
      };

    case ReservationActionTypes.SAVE_RESERVATION:
      return { ...state, dataState: ReservationStateEnum.LOADING };
    case ReservationActionTypes.SAVE_RESERVATION_SUCCES:
      return {
        ...state,
        dataState: ReservationStateEnum.LOADED,
        savereservations: (<ReservationActions>action).payload,
      };
    case ReservationActionTypes.SAVE_RESERVATION_ERROR:
      return {
        ...state,
        dataState: ReservationStateEnum.ERROR,
        errorMessage: (<ReservationActions>action).payload,
      };


      case ReservationActionTypes.SAVE_ENCAISSEMENT_RESERVATION:
        return { ...state, dataState: ReservationStateEnum.LOADING };
      case ReservationActionTypes.SAVE_ENCAISSEMENT_RESERVATION_SUCCES:
        return {
          ...state,
          dataState: ReservationStateEnum.LOADED,
          encaissementreservation: (<ReservationActions>action).payload,
        };
      case ReservationActionTypes.SAVE_ENCAISSEMENT_RESERVATION_ERROR:
        return {
          ...state,
          dataState: ReservationStateEnum.ERROR,
          errorMessage: (<ReservationActions>action).payload,
        };

        case ReservationActionTypes.GET_LISTE_ENCAISSEMENT_RESERVATION_BIEN:
          return { ...state, dataState: ReservationStateEnum.LOADING };
        case ReservationActionTypes.GET_LISTE_ENCAISSEMENT_RESERVATION_BIEN_SUCCES:
          return {
            ...state,
            dataState: ReservationStateEnum.LOADED,
            encaissementbiens: (<ReservationActions>action).payload,
          };
        case ReservationActionTypes.GET_LISTE_ENCAISSEMENT_RESERVATION_BIEN_ERROR:
          return {
            ...state,
            dataState: ReservationStateEnum.ERROR,
            errorMessage: (<ReservationActions>action).payload,
          };
    default:
      return { ...state };
  }
}
