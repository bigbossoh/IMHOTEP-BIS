import { AgenceRequestDto } from 'src/gs-api/src/models';
//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

//STORE
export enum ImagesActionsTypes {
  UPLOAD_LOGO = 'Upload logo',
  UPLOAD_LOGO_SUCCES = 'Upload logo Succes',
  UPLOAD_LOGO_ERROR = 'Upload logoError',

  GET_LOGO = 'Get Logo',
  GET_LOGO_SUCCES = 'get logo Succes',
  GET_LOGO_ERROR = '[EtageDto] Get All Etage Error',
}
// CREER LES DIFFERENTES ACTIONS
export class UploadLogoAcions implements Action {
  type: ImagesActionsTypes = ImagesActionsTypes.UPLOAD_LOGO;
  constructor(public payload: AgenceRequestDto) {}
}

export class UploadLogoAcionsSuccess implements Action {
  type: ImagesActionsTypes = ImagesActionsTypes.UPLOAD_LOGO_SUCCES;
  constructor(public payload: any) {}
}
export class UploadLogoAcionsError implements Action {
  type: ImagesActionsTypes = ImagesActionsTypes.UPLOAD_LOGO_ERROR;
  constructor(public payload: string) {}
}

// GET LOGO
export class GetLogoAcions implements Action {
  type: ImagesActionsTypes = ImagesActionsTypes.GET_LOGO;
  constructor(public payload: any) {}
}

export class GetLogoAcionsSuccess implements Action {
  type: ImagesActionsTypes = ImagesActionsTypes.GET_LOGO_SUCCES;
  constructor(public payload: any) {}
}
export class GetLogoAcionsError implements Action {
  type: ImagesActionsTypes = ImagesActionsTypes.GET_LOGO_ERROR;
  constructor(public payload: string) {}
}

export type ImagesActions =
  | UploadLogoAcions
  | UploadLogoAcionsError
  | UploadLogoAcionsSuccess
  | GetLogoAcions
  | GetLogoAcionsError
  | GetLogoAcionsSuccess;
