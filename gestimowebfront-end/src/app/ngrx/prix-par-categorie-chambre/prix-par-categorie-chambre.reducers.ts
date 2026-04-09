import { Action } from '@ngrx/store';
import { PrixParCategorieChambreActions, PrixParCategorieChambreActionsTypes } from './prix-par-categorie-chambre.action';


export enum PrixParCategorieChambreStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
  LOADEDBYIMMEUNLE = 'LoadedByImmeuble',
}
export interface PrixParCategorieChambreState {
  listPrixParCategorieChambre: any;
savePrix:any;
  errorMessage: string;
  dataState: PrixParCategorieChambreStateEnum;
}
const initState: PrixParCategorieChambreState = {
  listPrixParCategorieChambre: null,
  savePrix:null,
  errorMessage: '',
  dataState: PrixParCategorieChambreStateEnum.INITIAL,
};
export function prixParCategorieChambreReducer(
  state: PrixParCategorieChambreState = initState,
  action: Action
): PrixParCategorieChambreState {
  switch (action.type) {
    case PrixParCategorieChambreActionsTypes.LISTE_PRIX_PAR_CATEGORIE_CHAMBRE:
      return { ...state, dataState: PrixParCategorieChambreStateEnum.LOADING };
    case PrixParCategorieChambreActionsTypes.LISTE_PRIX_PAR_CATEGORIE_CHAMBRE_SUCCES:
      return {
        ...state,
        dataState: PrixParCategorieChambreStateEnum.LOADED,
        listPrixParCategorieChambre: (<PrixParCategorieChambreActions>action).payload,
      };
    case PrixParCategorieChambreActionsTypes.LISTE_PRIX_PAR_CATEGORIE_CHAMBRE_ERROR:
      return {
        ...state,
        dataState: PrixParCategorieChambreStateEnum.ERROR,
        errorMessage: (<PrixParCategorieChambreActions>action).payload,
      };


      case PrixParCategorieChambreActionsTypes.SAVE_PRIX_PAR_CATEGORIE_CHAMBRE:
        return { ...state, dataState: PrixParCategorieChambreStateEnum.LOADING };
      case PrixParCategorieChambreActionsTypes.SAVE_PRIX_PAR_CATEGORIE_CHAMBRE_SUCCES:
        return {
          ...state,
          dataState: PrixParCategorieChambreStateEnum.LOADED,
          savePrix: (<PrixParCategorieChambreActions>action).payload,
        };
      case PrixParCategorieChambreActionsTypes.SAVE_PRIX_PAR_CATEGORIE_CHAMBRE_ERROR:
        return {
          ...state,
          dataState: PrixParCategorieChambreStateEnum.ERROR,
          errorMessage: (<PrixParCategorieChambreActions>action).payload,
        };

    default:
      return { ...state };
  }
}
