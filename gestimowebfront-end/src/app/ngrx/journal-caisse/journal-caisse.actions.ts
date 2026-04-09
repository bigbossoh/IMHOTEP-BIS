import { SuivieDepenseDto } from './../../../gs-api/src/models/suivie-depense-dto';
//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

import {} from 'src/gs-api/src/models';

//STORE
export enum SuiviDepenseActionsTypes {
  SAVE_SUIVI_DEPENSE = '[SuivieDepenseDto] Save Suivi Depense',
  SAVE_SUIVI_DEPENSE_SUCCES = '[SuivieDepenseDto] Save Suivi Depense Succes',
  SAVE_SUIVI_DEPENSE_ERROR = '[SuivieDepenseDto] Save Suivi Depense Error',

  SAVE_SUPPR_SUIVI_DEPENSE = '[SuivieDepenseDto] Save Suppr Suivi Depense',
  SAVE_SUPPR_SUIVI_DEPENSE_SUCCES = '[SuivieDepenseDto] Save Suppr Suivi Depense Succes',
  SAVE_SUPPR_SUIVI_DEPENSE_ERROR = '[SuivieDepenseDto] Save Suppr Suivi Depense Error',

  GET_ALL_SUIVI_DEPENSE = '[SuivieDepenseDto] Get All Suivi Depense',
  GET_ALL_SUIVI_DEPENSE_SUCCES = '[SuivieDepenseDto] Get All Suivi Depense Succes',
  GET_ALL_SUIVI_DEPENSE_ERROR = '[SuivieDepenseDto] Get All Suivi Depense Error',

  GET_SUIVI_DEPENSE_PAR_PERIODE = '[SuivieDepenseDto] Save Suivi Depense TOTAL',
  GET_SUIVI_DEPENSE_PAR_PERIODE_SUCCES = '[SuivieDepenseDto] Save Suivi Depense Succes TOTAL ',
  GET_SUIVI_DEPENSE_PAR_PERIODE_ERROR = '[SuivieDepenseDto] Save Suivi Depense Error TOTAL',

  GET_ALL_SUIVI_DEPENSE_DEUX_DATE = '[SuivieDepenseDto] Get All Suivi Depense Deux Dates',
  GET_ALL_SUIVI_DEPENSE_DEUX_DATE_SUCCES = '[SuivieDepenseDto] Get All Suivi Depense Deux Dates Succes',
  GET_ALL_SUIVI_DEPENSE_DEUX_DATE_ERROR = '[SuivieDepenseDto] Get All Suivi Depense Deux Dates Error',


  GET_ALL_SUIVI_DEPENSE_ENTRE_DEUX_DATE = '[SuivieDepenseDto] Get All Suivi Depense DEUX DATE',
  GET_ALL_SUIVI_DEPENSE_ENTRE_DEUX_DATE_SUCCES = '[SuivieDepenseDto] Get All Suivi Depense Succes DEUX DATE',
  GET_ALL_SUIVI_DEPENSE_ENTRE_DEUX_DATE_ERROR = '[SuivieDepenseDto] Get All Suivi Depense Error DEUX DATE',
}

export class SaveSuiviDepenseActions implements Action {
  type: SuiviDepenseActionsTypes = SuiviDepenseActionsTypes.SAVE_SUIVI_DEPENSE;
  constructor(public payload: any) {}
}

export class SaveSuiviDepenseActionsSuccess implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.SAVE_SUIVI_DEPENSE_SUCCES;
  constructor(public payload: any) {}
}
export class SaveSuiviDepenseActionsError implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.SAVE_SUIVI_DEPENSE_ERROR;
  constructor(public payload: string) {}
}
// SUPPRIMER UN ENREGISTREMENT
export class SaveSupprSuiviDepenseActions implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.SAVE_SUPPR_SUIVI_DEPENSE;
  constructor(public payload: any) {}
}

export class SaveSupprSuiviDepenseActionsSuccess implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.SAVE_SUPPR_SUIVI_DEPENSE_SUCCES;
  constructor(public payload: any) {}
}
export class SaveSupprSuiviDepenseActionsError implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.SAVE_SUPPR_SUIVI_DEPENSE_ERROR;
  constructor(public payload: string) {}
}

// GAT ALL SUIVI DEPENSE
export class GetAllSuiviDepenseActions implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE;
  constructor(public payload: any) {}
}

export class GetAllSuiviDepenseActionsSuccess implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_SUCCES;
  constructor(public payload: any) {}
}
export class GetAllSuiviDepenseActionsError implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_ERROR;
  constructor(public payload: string) {}
}

// ALL SUIVI ENTRE DEUX PERODES

export class GetSuiviDepenseTotalActions implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.GET_SUIVI_DEPENSE_PAR_PERIODE;
  constructor(public payload: any) {}
}

export class GetSuiviDepenseTotalActionsSuccess implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.GET_SUIVI_DEPENSE_PAR_PERIODE_SUCCES;
  constructor(public payload: any) {}
}
export class GetSuiviDepenseTotalActionsError implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.GET_SUIVI_DEPENSE_PAR_PERIODE_ERROR;
  constructor(public payload: string) {}
}

// ALL SUIVI ENTRE DEUX PERODES

export class GetSuiviDepenseDeuxDateActions implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_DEUX_DATE;
  constructor(public payload: any) {}
}

export class GetSuiviDepenseDeuxDateActionsSuccess implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_DEUX_DATE_SUCCES;
  constructor(public payload: any) {}
}
export class GetSuiviDepenseDeuxDateActionsError implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_DEUX_DATE_ERROR;
  constructor(public payload: string) {}
}


// GAT ALL SUIVI DEPENSE
export class GetAllSuiviDepenseEntreDeuxDateActions implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_DEUX_DATE;
  constructor(public payload: any) {}
}

export class GetAllSuiviDepenseEntreDeuxDateActionsSuccess implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_DEUX_DATE_SUCCES;
  constructor(public payload: any) {}
}
export class GetAllSuiviDepenseEntreDeuxDateActionsError implements Action {
  type: SuiviDepenseActionsTypes =
    SuiviDepenseActionsTypes.GET_ALL_SUIVI_DEPENSE_DEUX_DATE_ERROR;
  constructor(public payload: string) {}
}
export type JournalCaisseActions =
  | SaveSuiviDepenseActions
  | SaveSuiviDepenseActionsSuccess
  | SaveSuiviDepenseActionsError
  | GetAllSuiviDepenseActions
  | GetAllSuiviDepenseActionsError
  | GetAllSuiviDepenseActionsSuccess
  | SaveSupprSuiviDepenseActions
  | SaveSupprSuiviDepenseActionsError
  | SaveSupprSuiviDepenseActionsSuccess
  | GetSuiviDepenseTotalActions
  | GetSuiviDepenseTotalActionsSuccess
  | GetSuiviDepenseTotalActionsError
  | GetSuiviDepenseDeuxDateActions
  | GetSuiviDepenseDeuxDateActionsError
  | GetSuiviDepenseDeuxDateActionsSuccess
  |GetAllSuiviDepenseEntreDeuxDateActions
  |GetAllSuiviDepenseEntreDeuxDateActionsSuccess
  |GetAllSuiviDepenseEntreDeuxDateActionsError;

