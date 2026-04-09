import { LocataireEncaisDTO } from './../../../gs-api/src/models/locataire-encais-dto';
import { Action } from '@ngrx/store';
import { EncaissementPrincipalDTO } from '../../../gs-api/src/models/encaissement-principal-dto';
import {
  EncaissementActions,
  EncaissementActionsTypes,
} from './reglement.actions';
export enum EncaissementStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble',
}
export interface EncaissementState {
  encaissements: EncaissementPrincipalDTO[];
  encaissementsLoyer: any;
  encaissementsCloture:any;
  appelloyers: any;
  errorMessage: string;
  montantEncaisse: number;
  montantDue:number;
  dataState: EncaissementStateEnum;
  locatairesImpayer: LocataireEncaisDTO[];
  leLocataire: any;
}
const initState: EncaissementState = {
  encaissements: [],
  encaissementsLoyer: null,
  encaissementsCloture:null,
  appelloyers: null,
  montantEncaisse: 0,
  errorMessage: '',
  dataState: EncaissementStateEnum.INITIAL,
  leLocataire: null,
  locatairesImpayer: [],
  montantDue: 0
};
export function encaissementReducer(
  state: EncaissementState = initState,
  action: Action
): EncaissementState {
  switch (action.type) {
    case EncaissementActionsTypes.SAVE_ENCAISSEMENT:
      return { ...state, dataState: EncaissementStateEnum.LOADING };
    case EncaissementActionsTypes.SAVE_ENCAISSEMENT_SUCCES:
      return {
        ...state,
        dataState: EncaissementStateEnum.LOADED,
        encaissements: (<EncaissementActions>action).payload,
      };
    case EncaissementActionsTypes.SAVE_ENCAISSEMENT_ERROR:
      return {
        ...state,
        dataState: EncaissementStateEnum.ERROR,
        errorMessage: (<EncaissementActions>action).payload,
      };

      //ENCAISSEMENT GROUPE
      case EncaissementActionsTypes.SAVE_ENCAISSEMENT_GROUPE:
        return { ...state, dataState: EncaissementStateEnum.LOADING };
      case EncaissementActionsTypes.SAVE_ENCAISSEMENT_GROUPE_SUCCES:
        return {
          ...state,
          dataState: EncaissementStateEnum.LOADED,
          locatairesImpayer: (<EncaissementActions>action).payload,
        };
      case EncaissementActionsTypes.SAVE_ENCAISSEMENT_GROUPE_ERROR:
        return {
          ...state,
          dataState: EncaissementStateEnum.ERROR,
          errorMessage: (<EncaissementActions>action).payload,
        };
    // TOTAL ENCAISSEMENT
    case EncaissementActionsTypes.TOTAL_ENCAISSEMENT_PAR_JOUR:
      return { ...state, dataState: EncaissementStateEnum.LOADING };
    case EncaissementActionsTypes.TOTAL_ENCAISSEMENT_PAR_JOUR_SUCCES:
      return {
        ...state,
        dataState: EncaissementStateEnum.LOADED,
        montantEncaisse: (<EncaissementActions>action).payload,
      };
    case EncaissementActionsTypes.TOTAL_ENCAISSEMENT_PAR_JOUR_ERROR:
      return {
        ...state,
        dataState: EncaissementStateEnum.ERROR,
        errorMessage: (<EncaissementActions>action).payload,
      };
    // AFFCHAGE DES LOYERS POUR REGLEMENTS

    // SOMME ENCAISSEMENT
   case EncaissementActionsTypes.SOMME_ENCAISSEMENT_ENTRE_DEUX_DATE:
    return { ...state, dataState: EncaissementStateEnum.LOADING };
  case EncaissementActionsTypes.SOMME_ENCAISSEMENT_ENTRE_DEUX_DATE_SUCCES:
    return {
      ...state,
      dataState: EncaissementStateEnum.LOADED,
      montantEncaisse: (<EncaissementActions>action).payload,
    };
  case EncaissementActionsTypes.SOMME_ENCAISSEMENT_ENTRE_DEUX_DATE_ERROR:
    return {
      ...state,
      dataState: EncaissementStateEnum.ERROR,
      errorMessage: (<EncaissementActions>action).payload,
    };

    case EncaissementActionsTypes.GET_ALL_PERIODE_REGLEMENT_BY_BIEN:
      return { ...state, dataState: EncaissementStateEnum.LOADING };
    case EncaissementActionsTypes.GET_ALL_PERIODE_REGLEMENT_BY_BIEN_SUCCES:
      return {
        ...state,
        dataState: EncaissementStateEnum.LOADED,
        appelloyers: (<EncaissementActions>action).payload,
      };
    case EncaissementActionsTypes.GET_ALL_PERIODE_REGLEMENT_BY_BIEN_ERROR:
      return {
        ...state,
        dataState: EncaissementStateEnum.ERROR,
        errorMessage: (<EncaissementActions>action).payload,
      };

         // SOMME ENCAISSEMENT
   case EncaissementActionsTypes.SOMME_DUE_ENTRE_DEUX_DATE:
    return { ...state, dataState: EncaissementStateEnum.LOADING };
  case EncaissementActionsTypes.SOMME_DUE_ENTRE_DEUX_DATE_SUCCES:
    return {
      ...state,
      dataState: EncaissementStateEnum.LOADED,
      montantDue: (<EncaissementActions>action).payload,
    };
  case EncaissementActionsTypes.SOMME_DUE_ENTRE_DEUX_DATE_ERROR:
    return {
      ...state,
      dataState: EncaissementStateEnum.ERROR,
      errorMessage: (<EncaissementActions>action).payload,
    };

      //LISTE DES ENCAISSEMENTS ENTRE DEUX DATES
      case EncaissementActionsTypes.TOTAL_ENCAISSEMENT_ENTRE_DEUX_DATE:
        return { ...state, dataState: EncaissementStateEnum.LOADING };
      case EncaissementActionsTypes.TOTAL_ENCAISSEMENT_ENTRE_DEUX_DATE_SUCCES:
        return {
          ...state,
          dataState: EncaissementStateEnum.LOADED,
          encaissementsLoyer: (<EncaissementActions>action).payload,
        };
      case EncaissementActionsTypes.TOTAL_ENCAISSEMENT_ENTRE_DEUX_DATE_ERROR:
        return {
          ...state,
          dataState: EncaissementStateEnum.ERROR,
          errorMessage: (<EncaissementActions>action).payload,
        };

              //LISTE DES ENCAISSEMENTS ENTRE DEUX DATES
      case EncaissementActionsTypes.GET_ENCAISSEMENT_CLOTURE:
        return { ...state, dataState: EncaissementStateEnum.LOADING };
      case EncaissementActionsTypes.GET_ENCAISSEMENT_CLOTURE_SUCCES:
        return {
          ...state,
          dataState: EncaissementStateEnum.LOADED,
          encaissementsCloture: (<EncaissementActions>action).payload,
        };
      case EncaissementActionsTypes.GET_ENCAISSEMENT_CLOTURE_ERROR:
        return {
          ...state,
          dataState: EncaissementStateEnum.ERROR,
          errorMessage: (<EncaissementActions>action).payload,
        };
    // listes des encaisements
    case EncaissementActionsTypes.GET_ENCAISSEMENT_BY_BIEN:
      return { ...state, dataState: EncaissementStateEnum.LOADING };
    case EncaissementActionsTypes.GET_ENCAISSEMENT_BY_BIEN_SUCCES:
      return {
        ...state,
        dataState: EncaissementStateEnum.LOADED,
        encaissements: (<EncaissementActions>action).payload,
      };
    case EncaissementActionsTypes.GET_ENCAISSEMENT_BY_BIEN_ERROR:
      return {
        ...state,
        dataState: EncaissementStateEnum.ERROR,
        errorMessage: (<EncaissementActions>action).payload,
      };

    // GET ALL LOCATIRES POUR ENCAISSEMENT
    case EncaissementActionsTypes.GET_LOCATAIRE_ENCAISSEMENT:
      return { ...state, dataState: EncaissementStateEnum.LOADING };
    case EncaissementActionsTypes.GET_LOCATAIRE_ENCAISSEMENT_SUCCES:
      return {
        ...state,
        dataState: EncaissementStateEnum.LOADED,
        leLocataire: (<EncaissementActions>action).payload,
      };
    case EncaissementActionsTypes.GET_LOCATAIRE_ENCAISSEMENT_ERROR:
      return {
        ...state,
        dataState: EncaissementStateEnum.ERROR,
        errorMessage: (<EncaissementActions>action).payload,
      };
    // GET ALL LOCATIRES POUR ENCAISSEMENT
    case EncaissementActionsTypes.GET_LISTE_LOCATAIRE_ENCAISSEMENT:
      return { ...state, dataState: EncaissementStateEnum.LOADING };
    case EncaissementActionsTypes.GET_LISTE_LOCATAIRE_ENCAISSEMENT_SUCCES:
      return {
        ...state,
        dataState: EncaissementStateEnum.LOADED,
        locatairesImpayer: (<EncaissementActions>action).payload,
      };
    case EncaissementActionsTypes.GET_LISTE_LOCATAIRE_ENCAISSEMENT_ERROR:
      return {
        ...state,
        dataState: EncaissementStateEnum.ERROR,
        errorMessage: (<EncaissementActions>action).payload,
      };
    default:
      return { ...state };
  }
}
