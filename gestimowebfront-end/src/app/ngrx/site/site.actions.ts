//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

import { SiteResponseDto } from 'src/gs-api/src/models';
import { SiteRequestDto } from './../../../gs-api/src/models/site-request-dto';


//STORE


export enum SiteActionsTypes {


  GET_ALL_SITES = '[SiteResponseDto] Get All Sites ',
  GET_ALL_SITES_SUCCES = '[SiteResponseDto] Get All Sites Succes',
  GET_ALL_SITES_ERROR = '[SiteResponseDto] Get All Sites Error',

  CREATE_NEW_SITE = '[SiteRequestDto] create a new site',
  CREATE_NEW_SITE_SUCCES = '[SiteRequestDto] create a new site succes',
  CREATE_NEW_SITE_ERROR = '[SiteRequestDto] create a new site error',

  DELETE_SITE = '[SiteRequestDto] delete site',
  DELETE_SITE_SUCCES = '[SiteRequestDto] delete site succes',
  DELETE_SITE_ERROR = '[SiteRequestDto] delete site error',
  DeleteSiteAction = "DeleteSiteAction"
}
// CREER LES DIFFERENTES ACTIONS
export class GetAllSitesActions implements Action {
  type: SiteActionsTypes = SiteActionsTypes.GET_ALL_SITES;
  constructor(public payload: any) {}
}

export class GetAllSitesActionsSuccess implements Action {
  type: SiteActionsTypes = SiteActionsTypes.GET_ALL_SITES_SUCCES;
  constructor(public payload: SiteResponseDto[]) {}
}
export class GetAllSitesActionsError implements Action {
  type: SiteActionsTypes = SiteActionsTypes.GET_ALL_SITES_ERROR;
  constructor(public payload: string) {}
}

export class CreateNewSiteAction implements Action {
  type: SiteActionsTypes = SiteActionsTypes.CREATE_NEW_SITE;
  constructor(public payload: SiteRequestDto) {}
}

export class CreateNewSiteActionSuccess implements Action {
  type: SiteActionsTypes = SiteActionsTypes.CREATE_NEW_SITE_SUCCES;
  constructor(public payload: SiteResponseDto) {}
}
export class CreateNewSiteActionError implements Action {
  type: SiteActionsTypes = SiteActionsTypes.CREATE_NEW_SITE_ERROR;
  constructor(public payload: string) {}
}


//DELETE ACTIONS
export class DeleteSiteAction implements Action {
  type: SiteActionsTypes = SiteActionsTypes.DELETE_SITE;
  constructor(public payload: number) {}
}

export class DeleteSiteActionSuccess implements Action {
  type: SiteActionsTypes = SiteActionsTypes.DELETE_SITE_SUCCES;
  constructor(public payload: boolean) {}
}
export class DeleteSiteActionError implements Action {
  type: SiteActionsTypes = SiteActionsTypes.DELETE_SITE_ERROR;
  constructor(public payload: string) {}
}

export type SiteActions =
  | GetAllSitesActions
  | GetAllSitesActionsError
  | GetAllSitesActionsSuccess

  | CreateNewSiteActionError
  | CreateNewSiteActionSuccess
  | CreateNewSiteAction

  | DeleteSiteAction
  | DeleteSiteActionError
  | DeleteSiteActionSuccess;
