import { QuartierResponseDto } from './../../../gs-api/src/models/quartier-response-dto';
import { Action } from '@ngrx/store';

//STORE
export enum QuartierActionsTypes {
  //GET ETAGE BY IMMEUBLE
  GET_ALL_QUARTIER_BY_COMMUNE = '[QuartierResponseDto] Get All Quartier BY Commune',
  GET_ALL_QUARTIER_BY_COMMUNE_SUCCES = '[QuartierResponseDto] Get All Quartier BY Commune SUCCUS',
  GET_ALL_QUARTIER_BY_COMMUNE_ERROR = '[QuartierResponseDto] Get All Quartier BY Commune ERROR',
}
//RECHERCHER ETAGE PAR IMMEUBLE

export class GetAllQuartierByCommuneActions implements Action {
  type: QuartierActionsTypes = QuartierActionsTypes.GET_ALL_QUARTIER_BY_COMMUNE;
  constructor(public payload: number) {}
}

export class GetAllQuartierByCommuneActionsSuccess implements Action {
  type: QuartierActionsTypes =
    QuartierActionsTypes.GET_ALL_QUARTIER_BY_COMMUNE_SUCCES;
  constructor(public payload: any) {}
}
export class GetAllQuartierByCommuneActionsError implements Action {
  type: QuartierActionsTypes =
    QuartierActionsTypes.GET_ALL_QUARTIER_BY_COMMUNE_ERROR;
  constructor(public payload: string) {}
}

export type QuartierActions =
  | GetAllQuartierByCommuneActions
  | GetAllQuartierByCommuneActionsError
  | GetAllQuartierByCommuneActionsSuccess;
