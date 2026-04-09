import { SuivieDepenseDto } from './../../../gs-api/src/models/suivie-depense-dto';
import { Action } from '@ngrx/store';
import { EtageAfficheDto, EtageDto } from 'src/gs-api/src/models';
import {
  SuiviDepenseActionsTypes,
  JournalCaisseActions,
} from './journal-caisse.actions';
export enum SuiviDepenseStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
}
export interface SuiviDepenseState {
  suiviDepenses: any;
  suiviDepensesCloture:any;
  totalEncaisse: any;
  errorMessage: string;
  dataState: SuiviDepenseStateEnum;
}
const initState: SuiviDepenseState = {
  totalEncaisse: 0,
  suiviDepensesCloture:null,
  suiviDepenses: [],
  errorMessage: '',
  dataState: SuiviDepenseStateEnum.LOADING,
};
export function suiviDepenseReducer(
  state: SuiviDepenseState = initState,
  action: Action
): SuiviDepenseState {
  switch (action.type) {
    //SAVE ETAGE
    case SuiviDepenseActionsTypes.SAVE_SUIVI_DEPENSE:
      return { ...state, dataState: SuiviDepenseStateEnum.LOADING };
    case SuiviDepenseActionsTypes.SAVE_SUIVI_DEPENSE_SUCCES:
      return {
        ...state,
        dataState: SuiviDepenseStateEnum.LOADED,
        suiviDepenses: (<JournalCaisseActions>action).payload,
      };
    case SuiviDepenseActionsTypes.SAVE_SUIVI_DEPENSE_ERROR:
      return {
        ...state,
        dataState: SuiviDepenseStateEnum.ERROR,
        errorMessage: (<JournalCaisseActions>action).payload,
      };
    //GET ALL SUIVIS DEPENSES ENTRE DEUX DATES
    case SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_DEUX_DATE:
      return { ...state, dataState: SuiviDepenseStateEnum.LOADING };
    case SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_DEUX_DATE_SUCCES:
      return {
        ...state,
        dataState: SuiviDepenseStateEnum.LOADED,
        suiviDepensesCloture: (<JournalCaisseActions>action).payload,
      };
    case SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_DEUX_DATE_ERROR:
      return {
        ...state,
        dataState: SuiviDepenseStateEnum.ERROR,
        errorMessage: (<JournalCaisseActions>action).payload,
      };
    //GET ALL SUIVI DEPENSE
    case SuiviDepenseActionsTypes.GET_SUIVI_DEPENSE_PAR_PERIODE:
      return { ...state, dataState: SuiviDepenseStateEnum.LOADING };
    case SuiviDepenseActionsTypes.GET_SUIVI_DEPENSE_PAR_PERIODE_SUCCES:
      return {
        ...state,
        dataState: SuiviDepenseStateEnum.LOADED,
        totalEncaisse: (<JournalCaisseActions>action).payload,
      };
    case SuiviDepenseActionsTypes.GET_SUIVI_DEPENSE_PAR_PERIODE_ERROR:
      return {
        ...state,
        dataState: SuiviDepenseStateEnum.ERROR,
        errorMessage: (<JournalCaisseActions>action).payload,
      };
    //SUPPRIMER UN ENCAISSEMENT

    case SuiviDepenseActionsTypes.SAVE_SUPPR_SUIVI_DEPENSE:
      return { ...state, dataState: SuiviDepenseStateEnum.LOADING };
    case SuiviDepenseActionsTypes.SAVE_SUPPR_SUIVI_DEPENSE_SUCCES:
      return {
        ...state,
        dataState: SuiviDepenseStateEnum.LOADED,
        suiviDepenses: (<JournalCaisseActions>action).payload,
      };
    case SuiviDepenseActionsTypes.SAVE_SUPPR_SUIVI_DEPENSE_ERROR:
      return {
        ...state,
        dataState: SuiviDepenseStateEnum.ERROR,
        errorMessage: (<JournalCaisseActions>action).payload,
      };
    // GET ALL SUIVI DEPENSE
    case SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE:
      return { ...state, dataState: SuiviDepenseStateEnum.LOADING };

    case SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_SUCCES:
      return {
        ...state,
        dataState: SuiviDepenseStateEnum.LOADED,
        suiviDepenses: (<JournalCaisseActions>action).payload,
      };

    case SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_ERROR:
      return {
        ...state,
        dataState: SuiviDepenseStateEnum.ERROR,
        errorMessage: (<JournalCaisseActions>action).payload,
      };

    default:
      return { ...state };
  }
}
