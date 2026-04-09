//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

import { AppartementDto } from 'src/gs-api/src/models';

//STORE
export enum AppartementctionsTypes {
  SAVE_APPARTEMENT = '[AppartementDto] Get Save Appartement',
  SAVE_APPARTEMENT_SUCCES = '[AppartementDto] Get Save AppartementSucces',
  SAVE_APPARTEMENT_ERROR = '[AppartementDto] Get Save Appartement Error',

  SAVE_APPARTEMENT_CATE = '[AppartementDto] Get Save Appartement _CATE',
  SAVE_APPARTEMENT_CATE_SUCCES = '[AppartementDto] Get Save AppartementSucces _CATE',
  SAVE_APPARTEMENT_CATE_ERROR = '[AppartementDto] Get Save Appartement Error _CATE',

  GET_ALL_APPARTEMENT_LIBRE = '[AppartementDto] Get All AppartementDto Libre',
  GET_ALL_APPARTEMENT_LIBRE_SUCCES = '[AppartementDto] Get All AppartementDto Libre Succes',
  GET_ALL_APPARTEMENT_LIBRE_ERROR = '[AppartementDto] Get All AppartementDto Libre Error',

  GET_APPARTEMENT_BY_ID = '[AppartementDto] Get  AppartementDto by Id',
  GET_APPARTEMENT_BY_ID_SUCCES = '[AppartementDto] Get  AppartementDto by id Succes',
  GET_APPARTEMENT_BY_ID_ERROR = '[AppartementDto] Get  AppartementDto by id Error',

  GET_ALL_APPARTEMENT = '[AppartementDto] Get All AppartementDto',
  GET_ALL_APPARTEMENT_SUCCES = '[AppartementDto] Get All AppartementDto Succes',
  GET_ALL_APPARTEMENT_ERROR = '[AppartementDto] Get All AppartementDto Error',

  GET_ALL_APPARTEMENT_MEUBLE = '[AppartementDto] Get All Meuble AppartementDto',
  GET_ALL_APPARTEMENT_MEUBLE_SUCCES = '[AppartementDto] Get All Meuble AppartementDto Succes',
  GET_ALL_APPARTEMENT_MEUBLE_ERROR = '[AppartementDto] Get All Meuble AppartementDto Error',

  GET_ALL_APPARTEMENT_MEUBLE_PAR_CATEGORIE = '[AppartementDto] Get All Meuble _PAR_CATEGORIE AppartementDto',
  GET_ALL_APPARTEMENT_MEUBLE_PAR_CATEGORIE_SUCCES = '[AppartementDto] Get All Meuble _PAR_CATEGORIE AppartementDto Succes',
  GET_ALL_APPARTEMENT_MEUBLE_PAR_CATEGORIE_ERROR = '[AppartementDto] Get All Meuble _PAR_CATEGORIE AppartementDto Error',
}
// CREER LES DIFFERENTES ACTIONS
export class SaveAppartementActions implements Action {
  type: AppartementctionsTypes = AppartementctionsTypes.SAVE_APPARTEMENT;
  constructor(public payload: AppartementDto) {}
}

export class SaveAppartementActionsSuccess implements Action {
  type: AppartementctionsTypes = AppartementctionsTypes.SAVE_APPARTEMENT_SUCCES;
  constructor(public payload: AppartementDto) {}
}
export class SaveAppartementActionsError implements Action {
  type: AppartementctionsTypes = AppartementctionsTypes.SAVE_APPARTEMENT_ERROR;
  constructor(public payload: string) {}
}
// CREER LES DIFFERENTES ACTIONS
export class GetAppartementByIdActions implements Action {
  type: AppartementctionsTypes = AppartementctionsTypes.GET_APPARTEMENT_BY_ID;
  constructor(public payload: number) {}
}

export class GetAppartementByIdActionsSuccess implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_APPARTEMENT_BY_ID_SUCCES;
  constructor(public payload: AppartementDto) {}
}
export class GetAppartementByIdActionsError implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_APPARTEMENT_BY_ID_SUCCES;
  constructor(public payload: string) {}
}
// GET ALL APPARTEMENT LIBRE
export class GetAllAppartementLibreActions implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_ALL_APPARTEMENT_LIBRE;
  constructor(public payload: any) {}
}

export class GetAllAppartementLibreActionsSuccess implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_ALL_APPARTEMENT_LIBRE_SUCCES;
  constructor(public payload: AppartementDto[]) {}
}
export class GetAllAppartementLibreActionsError implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_ALL_APPARTEMENT_LIBRE_ERROR;
  constructor(public payload: string) {}
}
// GET ALL APPARTEMENT
export class GetAllAppartementActions implements Action {
  type: AppartementctionsTypes = AppartementctionsTypes.GET_ALL_APPARTEMENT;
  constructor(public payload: any) {}
}

export class GetAllAppartementActionsSuccess implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_ALL_APPARTEMENT_SUCCES;
  constructor(public payload: AppartementDto[]) {}
}
export class GetAllAppartementActionsError implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_ALL_APPARTEMENT_ERROR;
  constructor(public payload: string) {}
}

// GET ALL APPARTEMENT MEUBLE
export class GetAllAppartementMeubleActions implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_ALL_APPARTEMENT_MEUBLE;
  constructor(public payload: any) {}
}

export class GetAllAppartementMeubleActionsSuccess implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_ALL_APPARTEMENT_MEUBLE_SUCCES;
  constructor(public payload: any) {}
}
export class GetAllAppartementMeubleActionsError implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_ALL_APPARTEMENT_MEUBLE_ERROR;
  constructor(public payload: string) {}
}

export class GetAllAppartementMeubleParCategorieActions implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_ALL_APPARTEMENT_MEUBLE_PAR_CATEGORIE;
  constructor(public payload: any) {}
}

export class GetAllAppartementMeubleParCategorieActionsSuccess
  implements Action
{
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_ALL_APPARTEMENT_MEUBLE_PAR_CATEGORIE_SUCCES;
  constructor(public payload: any) {}
}
export class GetAllAppartementMeubleParCategorieActionsError implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.GET_ALL_APPARTEMENT_MEUBLE_PAR_CATEGORIE_ERROR;
  constructor(public payload: string) {}
}

export class SaveAppartementCatActions implements Action {
  type: AppartementctionsTypes = AppartementctionsTypes.SAVE_APPARTEMENT_CATE;
  constructor(public payload: AppartementDto) {}
}

export class SaveAppartementCatActionsSuccess implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.SAVE_APPARTEMENT_CATE_SUCCES;
  constructor(public payload: any) {}
}
export class SaveAppartementCatActionsError implements Action {
  type: AppartementctionsTypes =
    AppartementctionsTypes.SAVE_APPARTEMENT_CATE_ERROR;
  constructor(public payload: string) {}
}
export type AppartementActions =
  | SaveAppartementActions
  | SaveAppartementActionsSuccess
  | SaveAppartementActionsError
  | GetAllAppartementLibreActions
  | GetAllAppartementLibreActionsError
  | GetAllAppartementLibreActionsSuccess
  | GetAllAppartementActions
  | GetAllAppartementActionsError
  | GetAllAppartementActionsSuccess
  | GetAppartementByIdActions
  | GetAppartementByIdActionsError
  | GetAppartementByIdActionsSuccess
  | GetAllAppartementMeubleActions
  | GetAllAppartementMeubleActionsError
  | GetAllAppartementMeubleActionsSuccess
  | GetAllAppartementMeubleParCategorieActions
  | GetAllAppartementMeubleParCategorieActionsError
  | GetAllAppartementMeubleParCategorieActionsSuccess
  | SaveAppartementCatActions
  | SaveAppartementCatActionsError
  | SaveAppartementCatActionsSuccess;
