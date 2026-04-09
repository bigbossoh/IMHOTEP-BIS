import { Action } from '@ngrx/store';

//STORE
export enum CategorieChambreActionsTypes {
  //GET ETAGE BY IMMEUBLE
  LISTE_CATEGORIE_CHAMBRE = 'LISTE CATEGORIE CHAMBRE',
  LISTE_CATEGORIE_CHAMBRE_SUCCES = 'LISTE CATEGORIE CHAMBRE SUCCES',
  LISTE_CATEGORIE_CHAMBRE_ERROR = 'LISTE CATEGORIE CHAMBREERROR',

  SAVE_CATEGORIE_CHAMBRE = 'SAVE CATEGORIE CHAMBRE',
  SAVE_CATEGORIE_CHAMBRE_SUCCES = 'SAVE CATEGORIE CHAMBRE SUCCES',
  SAVE_CATEGORIE_CHAMBRE_ERROR = 'SAVE CATEGORIE CHAMBREERROR',
}

export class ListChambreCategorieActions implements Action {
  type: CategorieChambreActionsTypes =
  CategorieChambreActionsTypes.LISTE_CATEGORIE_CHAMBRE;
  constructor(public payload: any) {}
}

export class ListChambreCategorieActionssSuccess implements Action {
  type: CategorieChambreActionsTypes =
  CategorieChambreActionsTypes.LISTE_CATEGORIE_CHAMBRE_SUCCES;
  constructor(public payload: any) {}
}
export class ListChambreCategorieActionsError implements Action {
  type: CategorieChambreActionsTypes =
  CategorieChambreActionsTypes.LISTE_CATEGORIE_CHAMBRE_ERROR;
  constructor(public payload: string) {}
}

export class SaveChambreCategorieActions implements Action {
  type: CategorieChambreActionsTypes =
  CategorieChambreActionsTypes.SAVE_CATEGORIE_CHAMBRE;
  constructor(public payload: any) {}
}

export class SaveChambreCategorieActionssSuccess implements Action {
  type: CategorieChambreActionsTypes =
  CategorieChambreActionsTypes.SAVE_CATEGORIE_CHAMBRE_SUCCES;
  constructor(public payload: any) {}
}
export class SaveChambreCategorieActionsError implements Action {
  type: CategorieChambreActionsTypes =
  CategorieChambreActionsTypes.SAVE_CATEGORIE_CHAMBRE_ERROR;
  constructor(public payload: string) {}
}
export type CategorieChambreActions =
  | ListChambreCategorieActions
  | ListChambreCategorieActionssSuccess
  | ListChambreCategorieActionsError
  |SaveChambreCategorieActions
  |SaveChambreCategorieActionsError
  |SaveChambreCategorieActionssSuccess;
