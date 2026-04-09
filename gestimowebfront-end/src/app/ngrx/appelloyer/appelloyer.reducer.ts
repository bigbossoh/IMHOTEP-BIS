import { Action } from '@ngrx/store';

import { AppelLoyerActions, AppelLoyerctionsTypes } from './appelloyer.actions';
import { AppelLoyersFactureDto } from '../../../gs-api/src/models/appel-loyers-facture-dto';
import { AnneeAppelLoyersDto } from '../../../gs-api/src/models/annee-appel-loyers-dto';
import { PeriodeDto } from '../../../gs-api/src/models/periode-dto';
export enum AppelLoyerStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble',
}
export interface AppelLoyerState {
  smss: any;
  statPeriode:any;
  statAnnee:any;
  appelloyers: AppelLoyersFactureDto[];
  anneesAppel: AnneeAppelLoyersDto[];
  periodes: PeriodeDto[];
  impayerAnnee: number;
  payerAnnee: number;
  impayerPeriode: number;
  payerPeriode: number;
  errorMessage: string;
  dataState: AppelLoyerStateEnum;
}
const initState: AppelLoyerState = {
  smss: null,
  statPeriode:null,
  statAnnee:null,
  appelloyers: [],
  anneesAppel: [],
  periodes: [],
  impayerAnnee: 0,
  payerPeriode: 0,
  impayerPeriode: 0,
  payerAnnee: 0,
  errorMessage: '',
  dataState: AppelLoyerStateEnum.INITIAL,
};
export function appelLoyerReducer(
  state: AppelLoyerState = initState,
  action: Action
): AppelLoyerState {
  switch (action.type) {
    // GET ALL APPEL LOYER
    case AppelLoyerctionsTypes.GET_ALL_APPELLOYER:
      return { ...state, dataState: AppelLoyerStateEnum.LOADING };
    case AppelLoyerctionsTypes.GET_ALL_APPELLOYER_SUCCES:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.LOADED,
        appelloyers: (<AppelLoyerActions>action).payload,
      };
    case AppelLoyerctionsTypes.GET_ALL_APPELLOYER_ERROR:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.ERROR,
        errorMessage: (<AppelLoyerActions>action).payload,
      };
    // GET STAT PAR  APPEL LOYER
    case AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_PERIODE:
      return { ...state, dataState: AppelLoyerStateEnum.LOADING };
    case AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_PERIODE_SUCCES:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.LOADED,
        statPeriode: (<AppelLoyerActions>action).payload,
      };
    case AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_PERIODE_ERROR:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.ERROR,
        errorMessage: (<AppelLoyerActions>action).payload,
      };
//GET STAT PAR ANNEE
      case AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_ANNEE:
        return { ...state, dataState: AppelLoyerStateEnum.LOADING };
      case AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_ANNEE_SUCCES:
        return {
          ...state,
          dataState: AppelLoyerStateEnum.LOADED,
          statAnnee: (<AppelLoyerActions>action).payload,
        };
      case AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_ANNEE_ERROR:
        return {
          ...state,
          dataState: AppelLoyerStateEnum.ERROR,
          errorMessage: (<AppelLoyerActions>action).payload,
        };
    // GET ALL APPEL LOYER BY PERIODE
    case AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_PERIODE:
      return { ...state, dataState: AppelLoyerStateEnum.LOADING };
    case AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_PERIODE_SUCCES:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.LOADED,
        appelloyers: (<AppelLoyerActions>action).payload,
      };
    case AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_PERIODE_ERROR:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.ERROR,
        errorMessage: (<AppelLoyerActions>action).payload,
      };

    // SAVE REDUCTION LOYER
    case AppelLoyerctionsTypes.SAVE_REDUCTION_LOYER:
      return { ...state, dataState: AppelLoyerStateEnum.LOADING };
    case AppelLoyerctionsTypes.SAVE_REDUCTION_LOYER_SUCCES:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.LOADED,
        appelloyers: (<AppelLoyerActions>action).payload,
      };
    case AppelLoyerctionsTypes.SAVE_REDUCTION_LOYER_ERROR:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.ERROR,
        errorMessage: (<AppelLoyerActions>action).payload,
      };
   // SAVE SUPPRIMER LOYER
   case AppelLoyerctionsTypes.SAVE_SUPPRIMER_LOYER:
    return { ...state, dataState: AppelLoyerStateEnum.LOADING };
  case AppelLoyerctionsTypes.SAVE_SUPPRIMER_LOYER_SUCCES:
    return {
      ...state,
      dataState: AppelLoyerStateEnum.LOADED,
      appelloyers: (<AppelLoyerActions>action).payload,
    };
  case AppelLoyerctionsTypes.SAVE_SUPPRIMER_LOYER_ERROR:
    return {
      ...state,
      dataState: AppelLoyerStateEnum.ERROR,
      errorMessage: (<AppelLoyerActions>action).payload,
    };
    // GET IMPAYER PAR ANNEE
    case AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_ANNEE:
      return { ...state, dataState: AppelLoyerStateEnum.LOADING };
    case AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_ANNEE_SUCCES:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.LOADED,
        impayerAnnee: (<AppelLoyerActions>action).payload,
      };
    case AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_ANNEE_ERROR:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.ERROR,
        errorMessage: (<AppelLoyerActions>action).payload,
      };

    // GET IMPAYER PAR PERIODE
    case AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_PERIODE:
      return { ...state, dataState: AppelLoyerStateEnum.LOADING };
    case AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_PERIODE_SUCCES:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.LOADED,
        impayerPeriode: (<AppelLoyerActions>action).payload,
      };
    case AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_PERIODE_ERROR:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.ERROR,
        errorMessage: (<AppelLoyerActions>action).payload,
      };
    // GET PAYER PAR PERIODE
    case AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_PERIODE:
      return { ...state, dataState: AppelLoyerStateEnum.LOADING };
    case AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_PERIODE_SUCCES:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.LOADED,
        payerPeriode: (<AppelLoyerActions>action).payload,
      };
    case AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_PERIODE_ERROR:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.ERROR,
        errorMessage: (<AppelLoyerActions>action).payload,
      };
    // GET PAYER PAR ANNEE
    case AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_ANNEE:
      return { ...state, dataState: AppelLoyerStateEnum.LOADING };
    case AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_ANNEE_SUCCES:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.LOADED,
        payerAnnee: (<AppelLoyerActions>action).payload,
      };
    case AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_ANNEE_ERROR:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.ERROR,
        errorMessage: (<AppelLoyerActions>action).payload,
      };
    // GET ALL APPEL LOYER ANNEE
    case AppelLoyerctionsTypes.GET_ALL_APPELLOYER_ANNEE:
      return { ...state, dataState: AppelLoyerStateEnum.LOADING };
    case AppelLoyerctionsTypes.GET_ALL_APPELLOYER_ANNEE_SUCCES:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.LOADED,
        anneesAppel: (<AppelLoyerActions>action).payload,
      };
    case AppelLoyerctionsTypes.GET_ALL_APPELLOYER_ANNEE_ERROR:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.ERROR,
        errorMessage: (<AppelLoyerActions>action).payload,
      };
    // GET ALL APPEL LOYER BY BIEN
    case AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_BAIL:
      return { ...state, dataState: AppelLoyerStateEnum.LOADING };
    case AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_BAIL_SUCCES:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.LOADED,
        appelloyers: (<AppelLoyerActions>action).payload,
      };
    case AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_BAIL_ERROR:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.ERROR,
        errorMessage: (<AppelLoyerActions>action).payload,
      };
    // GET ALL SMS BY LOCATAIRE
    case AppelLoyerctionsTypes.GET_ALL_SMS_BY_LOCATAIRE:
      return { ...state, dataState: AppelLoyerStateEnum.LOADING };
    case AppelLoyerctionsTypes.GET_ALL_SMS_BY_LOCATAIRE_SUCCES:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.LOADED,
        smss: (<AppelLoyerActions>action).payload,
      };
    case AppelLoyerctionsTypes.GET_ALL_SMS_BY_LOCATAIRE_ERROR:
      return {
        ...state,
        dataState: AppelLoyerStateEnum.ERROR,
        errorMessage: (<AppelLoyerActions>action).payload,
      };

    default:
      return { ...state };
  }
}
