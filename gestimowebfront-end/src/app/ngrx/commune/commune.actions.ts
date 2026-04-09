//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';


//STORE
export enum CommunesActionsTypes {
  //GET ETAGE BY IMMEUBLE
  GET_ALL_COMMUNE_BY_VILLE = '[CommuneDto] Get All Commmune BY Ville',
  GET_ALL_COMMUNE_BY_VILLE_SUCCES = '[CommuneDto] Get All Commmune BY Ville SUCCUS',
  GET_ALL_COMMUNE_BY_VILLE_ERROR = '[CommuneDto] Get All Commmune BY Ville ERROR',

}

//RECHERCHER ETAGE PAR IMMEUBLE

export class GetAllCommunesByVilleActions implements Action {
  type: CommunesActionsTypes = CommunesActionsTypes.GET_ALL_COMMUNE_BY_VILLE;
  constructor(public payload: number) { }
}

export class GetAllCommunesByVilleActionsSuccess implements Action {
  type: CommunesActionsTypes =
    CommunesActionsTypes.GET_ALL_COMMUNE_BY_VILLE_SUCCES;
  constructor(public payload: any) { }
}
export class GetAllCommunesByVilleActionsError implements Action {
  type: CommunesActionsTypes =
    CommunesActionsTypes.GET_ALL_COMMUNE_BY_VILLE_ERROR;
  constructor(public payload: string) { }
}

export type CommunesActions =
  | GetAllCommunesByVilleActions
  | GetAllCommunesByVilleActionsError
  | GetAllCommunesByVilleActionsSuccess;
