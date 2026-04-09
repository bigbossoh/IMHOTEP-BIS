import { Action } from '@ngrx/store';
import { PrixParCategorieChambreDto } from 'src/gs-api/src/models';

//STORE
export enum PrixParCategorieChambreActionsTypes {
  //GET ETAGE BY IMMEUBLE
  LISTE_PRIX_PAR_CATEGORIE_CHAMBRE = 'LISTE CATEGORIE CHAMBRE LISTE_PRIX_PAR_CATEGORIE_CHAMBRE',
  LISTE_PRIX_PAR_CATEGORIE_CHAMBRE_SUCCES = 'LISTE CATEGORIE CHAMBRE LISTE_PRIX_PAR_CATEGORIE_CHAMBRE SUCCES',
  LISTE_PRIX_PAR_CATEGORIE_CHAMBRE_ERROR = 'LISTE CATEGORIE LISTE_PRIX_PAR_CATEGORIE_CHAMBRE CHAMBRE ERROR',

  SAVE_PRIX_PAR_CATEGORIE_CHAMBRE = 'LISTE CATEGORIE CHAMBRE SAVE_PRIX_PAR_CATEGORIE_CHAMBRE',
  SAVE_PRIX_PAR_CATEGORIE_CHAMBRE_SUCCES = 'LISTE CATEGORIE CHAMBRE SAVE_PRIX_PAR_CATEGORIE_CHAMBRE SUCCES',
  SAVE_PRIX_PAR_CATEGORIE_CHAMBRE_ERROR = 'LISTE CATEGORIE SAVE CHAMBRE ERROR',
}

export class ListPrixChambreParCategorieActions implements Action {
  type: PrixParCategorieChambreActionsTypes =
    PrixParCategorieChambreActionsTypes.LISTE_PRIX_PAR_CATEGORIE_CHAMBRE;
  constructor(public payload: any) {}
}

export class ListPrixChambreParCategorieActionsSuccess implements Action {
  type: PrixParCategorieChambreActionsTypes =
    PrixParCategorieChambreActionsTypes.LISTE_PRIX_PAR_CATEGORIE_CHAMBRE_SUCCES;
  constructor(public payload: PrixParCategorieChambreDto[]) {}
}
export class ListPrixChambreParCategorieActionsError implements Action {
  type: PrixParCategorieChambreActionsTypes =
    PrixParCategorieChambreActionsTypes.LISTE_PRIX_PAR_CATEGORIE_CHAMBRE_ERROR;
  constructor(public payload: string) {}
}
export class SavePrixChambreParCategorieActions implements Action {
  type: PrixParCategorieChambreActionsTypes =
    PrixParCategorieChambreActionsTypes.SAVE_PRIX_PAR_CATEGORIE_CHAMBRE;
  constructor(public payload: any) {}
}

export class SavePrixChambreParCategorieActionsSuccess implements Action {
  type: PrixParCategorieChambreActionsTypes =
    PrixParCategorieChambreActionsTypes.SAVE_PRIX_PAR_CATEGORIE_CHAMBRE_SUCCES;
  constructor(public payload: any) {}
}
export class SavePrixChambreParCategorieActionsError implements Action {
  type: PrixParCategorieChambreActionsTypes =
    PrixParCategorieChambreActionsTypes.SAVE_PRIX_PAR_CATEGORIE_CHAMBRE_ERROR;
  constructor(public payload: string) {}
}
export type PrixParCategorieChambreActions =
  | ListPrixChambreParCategorieActions
  | ListPrixChambreParCategorieActionsSuccess
  | ListPrixChambreParCategorieActionsError
  | SavePrixChambreParCategorieActions
  | SavePrixChambreParCategorieActionsError
  | SavePrixChambreParCategorieActionsSuccess;
