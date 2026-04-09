import { PeriodeDto } from './../../../gs-api/src/models/periode-dto';
import { EtagesState } from 'src/app/ngrx/etage/etage.reducer';
import { AppelLoyersFactureDto } from './../../../gs-api/src/models/appel-loyers-facture-dto';
//CREER LES DIFFERENTES TYPES D'ACTION QUI VONT DECLANCHER LES EVENE,ENT DANS LE

import { Action } from '@ngrx/store';

import { AppelLoyerDto } from 'src/gs-api/src/models';
import { AnneeAppelLoyersDto } from '../../../gs-api/src/models/annee-appel-loyers-dto';

//STORE
export enum AppelLoyerctionsTypes {
  SAVE_REDUCTION_LOYER = '[AppelLoyer] SAVE REDUCTION',
  SAVE_REDUCTION_LOYER_SUCCES = '[AppelLoyer] SAVE REDUCTION Succes',
  SAVE_REDUCTION_LOYER_ERROR = '[AppelLoyer] SAVE REDUCTION Error',

  SAVE_SUPPRIMER_LOYER = '[AppelLoyer] SAVE SUPPRIMER',
  SAVE_SUPPRIMER_LOYER_SUCCES = '[AppelLoyer] SAVE SUPPRIMER Succes',
  SAVE_SUPPRIMER_LOYER_ERROR = '[AppelLoyer] SAVE SUPPRIMER Error',

  GET_ALL_APPELLOYER_ANNEE = '[AppelLoyer] Get All AppelLoyer Année',
  GET_ALL_APPELLOYER_ANNEE_SUCCES = '[AppelLoyer] Get All AppelLoyer Années Succes',
  GET_ALL_APPELLOYER_ANNEE_ERROR = '[AppelLoyer] Get All AppelLoyer AnnéEtagesState Error',

  GET_ALL_APPELLOYER = '[AppelLoyer] Get All AppelLoyer',
  GET_ALL_APPELLOYER_SUCCES = '[AppelLoyer] Get All AppelLoyer Succes',
  GET_ALL_APPELLOYER_ERROR = '[AppelLoyer] Get All AppelLoyer Error',

  GET_ALL_APPELLOYER_BY_PERIODE = '[AppelLoyersFactureDto] Get All AppelLoyer By Periode',
  GET_ALL_APPELLOYER_BY_PERIODE_SUCCES = '[AppelLoyersFactureDto] Get All AppelLoyer By Periode Succes',
  GET_ALL_APPELLOYER_BY_PERIODE_ERROR = '[AppelLoyersFactureDto] Get All AppelLoyer By Periode Error',

  GET_IMPAYER_LOYER_PAR_ANNEE = '[AppelLoyersFactureDto] Get Impayer par annee',
  GET_IMPAYER_LOYER_PAR_ANNEE_SUCCES = '[AppelLoyersFactureDto] Get Impayer par annee Success',
  GET_IMPAYER_LOYER_PAR_ANNEE_ERROR = '[AppelLoyersFactureDto] Get Impayer par annee Error',

  GET_STAT_LOYER_PAR_PERIODE = 'Get stat par periode',
  GET_STAT_LOYER_PAR_PERIODE_SUCCES = ' Get stat par periode Success',
  GET_STAT_LOYER_PAR_PERIODE_ERROR = ' Get stat par periode Error',

  GET_STAT_LOYER_PAR_ANNEE = 'Get stat par ANNEE',
  GET_STAT_LOYER_PAR_ANNEE_SUCCES = ' Get stat par ANNEE Success',
  GET_STAT_LOYER_PAR_ANNEE_ERROR = ' Get stat par ANNEE Error',

  GET_PAYER_LOYER_PAR_ANNEE = '[AppelLoyersFactureDto] Get Payer par annee',
  GET_PAYER_LOYER_PAR_ANNEE_SUCCES = '[AppelLoyersFactureDto] Get Payer par annee Success',
  GET_PAYER_LOYER_PAR_ANNEE_ERROR = '[AppelLoyersFactureDto] Get Payer par annee Error',

  GET_IMPAYER_LOYER_PAR_PERIODE = '[AppelLoyersFactureDto] Get Impayer par PERIODE',
  GET_IMPAYER_LOYER_PAR_PERIODE_SUCCES = '[AppelLoyersFactureDto] Get Impayer par PERIODE Success',
  GET_IMPAYER_LOYER_PAR_PERIODE_ERROR = '[AppelLoyersFactureDto] Get Impayer par PERIODE Error',

  GET_PAYER_LOYER_PAR_PERIODE = '[AppelLoyersFactureDto] Get Payer par PERIODE',
  GET_PAYER_LOYER_PAR_PERIODE_SUCCES = '[AppelLoyersFactureDto] Get Payer par PERIODE Success',
  GET_PAYER_LOYER_PAR_PERIODE_ERROR = '[AppelLoyersFactureDto] Get Payer par PERIODE Error',

  GET_ALL_APPELLOYER_BY_BAIL = '[AppelLoyer] Get All AppelLoyer BY BIEN ',
  GET_ALL_APPELLOYER_BY_BAIL_SUCCES = '[AppelLoyer] Get All AppelLoyer Succes BY BIEN',
  GET_ALL_APPELLOYER_BY_BAIL_ERROR = '[AppelLoyer] Get All AppelLoyer Error BY BIEN',

  GET_ALL_SMS_BY_LOCATAIRE = '[AppelLoyer] Get All SMS  BY LOCATAIRE',
  GET_ALL_SMS_BY_LOCATAIRE_SUCCES = '[AppelLoyer] Get All SMS  BY LOCATAIRE Succes BY BIEN',
  GET_ALL_SMS_BY_LOCATAIRE_ERROR = '[AppelLoyer] Get All SMS  BY LOCATAIRE Error BY BIEN',
}

//GET IMPAYER PAR ANNEE
export class GetImayerLoyerParAnneeActions implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_ANNEE;
  constructor(public payload: any) {}
}

export class GetImayerLoyerParAnneeActionsSuccess implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_ANNEE_SUCCES;
  constructor(public payload: number) {}
}
export class GetImayerLoyerParAnneeActionsError implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_ANNEE_ERROR;
  constructor(public payload: string) {}
}

//GET PAYER PAR ANNEE
export class GetPayerLoyerParAnneeActions implements Action {
  type: AppelLoyerctionsTypes = AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_ANNEE;
  constructor(public payload: any) {}
}

export class GetPayerLoyerParAnneeActionsSuccess implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_ANNEE_SUCCES;
  constructor(public payload: number) {}
}
export class GetPayerLoyerParAnneeActionsError implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_ANNEE_ERROR;
  constructor(public payload: string) {}
}
//GET IMPAYER PAR PERIODE
export class GetImpayerLoyerParPeriodeActions implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_PERIODE;
  constructor(public payload: any) {}
}

export class GetImpayerLoyerParPeriodeActionsSuccess implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_PERIODE_SUCCES;
  constructor(public payload: number) {}
}
export class GetImpayerLoyerParPeriodeActionsError implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_PERIODE_ERROR;
  constructor(public payload: string) {}
}

//GET SATISTISQUE PAR PERIODE
export class GetStatLoyerParPeriodeActions implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_PERIODE;
  constructor(public payload: any) {}
}

export class GetStatLoyerParPeriodeActionsSuccess implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_PERIODE_SUCCES;
  constructor(public payload: any) {}
}
export class GetStatLoyerParPeriodeActionsError implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_PERIODE_ERROR;
  constructor(public payload: string) {}
}

//GET SATISTISQUE PAR ANNEE
export class GetStatLoyerParAnneeActions implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_ANNEE;
  constructor(public payload: any) {}
}

export class GetStatLoyerParAnneeActionsSuccess implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_ANNEE_SUCCES;
  constructor(public payload: any) {}
}
export class GetStatLoyerParAnneeActionsError implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_ANNEE_ERROR;
  constructor(public payload: string) {}
}
//GET PAYER PAR ANNEE
export class GetPayerLoyerParPeriodeActions implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_PERIODE;
  constructor(public payload: any) {}
}

export class GetPayerLoyerParPeriodeActionsSuccess implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_PERIODE_SUCCES;
  constructor(public payload: number) {}
}
export class GetPayerLoyerParPeriodeActionsError implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_PERIODE_ERROR;
  constructor(public payload: string) {}
}
// GET ALL APPEL LOYER
export class GetAllAppelLoyerActions implements Action {
  type: AppelLoyerctionsTypes = AppelLoyerctionsTypes.GET_ALL_APPELLOYER;
  constructor(public payload: any) {}
}

export class GetAllAppelLoyerActionsSuccess implements Action {
  type: AppelLoyerctionsTypes = AppelLoyerctionsTypes.GET_ALL_APPELLOYER_SUCCES;
  constructor(public payload: AppelLoyerDto[]) {}
}
export class GetAllAppelLoyerActionsError implements Action {
  type: AppelLoyerctionsTypes = AppelLoyerctionsTypes.GET_ALL_APPELLOYER_ERROR;
  constructor(public payload: string) {}
}

// GET ALL APPARTEMENT BY PERIODE
export class GetAllAppelLoyerByPeriodeActions implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_PERIODE;
  constructor(public payload: any) {}
}

export class GetAllAppelLoyerByPeriodeActionsSuccess implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_PERIODE_SUCCES;
  constructor(public payload: AppelLoyersFactureDto[]) {}
}
export class GetAllAppelLoyerByPeriodeActionsError implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_PERIODE_ERROR;
  constructor(public payload: string) {}
}
// GET ALL APPEL LOYER ANNEE
export class GetAllAppelLoyerAnneeActions implements Action {
  type: AppelLoyerctionsTypes = AppelLoyerctionsTypes.GET_ALL_APPELLOYER_ANNEE;
  constructor(public payload: string) {}
}

export class GetAllAppelLoyerAnneeActionsSuccess implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_ALL_APPELLOYER_ANNEE_SUCCES;
  constructor(public payload: AnneeAppelLoyersDto[]) {}
}
export class GetAllAppelLoyerAnneeActionsError implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_ALL_APPELLOYER_ANNEE_ERROR;
  constructor(public payload: string) {}
}

// SAVE REDUCTION
export class SaveReductionActions implements Action {
  type: AppelLoyerctionsTypes = AppelLoyerctionsTypes.SAVE_REDUCTION_LOYER;
  constructor(public payload: any) {}
}

export class SaveReductionActionsSuccess implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.SAVE_REDUCTION_LOYER_SUCCES;
  constructor(public payload: any) {}
}
export class SaveReductionActionsError implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.SAVE_REDUCTION_LOYER_ERROR;
  constructor(public payload: string) {}
}
// SAVE SUPPRIMER
export class SaveSupprimerActions implements Action {
  type: AppelLoyerctionsTypes = AppelLoyerctionsTypes.SAVE_SUPPRIMER_LOYER;
  constructor(public payload: any) {}
}

export class SaveSupprimerActionsSuccess implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.SAVE_SUPPRIMER_LOYER_SUCCES;
  constructor(public payload: AppelLoyersFactureDto[]) {}
}
export class SaveSupprimerActionsError implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.SAVE_SUPPRIMER_LOYER_ERROR;
  constructor(public payload: string) {}
}

// GET ALL APPEL LOYER BY BIEN
export class GetAllAppelLoyerByBailActions implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_BAIL;
  constructor(public payload: any) {}
}

export class GetAllAppelLoyerByBailActionsSuccess implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_BAIL_SUCCES;
  constructor(public payload: any) {}
}
export class GetAllAppelLoyerByBailActionsError implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_BAIL_ERROR;
  constructor(public payload: string) {}
}

// GET ALL SMS BY LOGIN LOCATAIRE
export class GetAllSmsByLocataireActions implements Action {
  type: AppelLoyerctionsTypes = AppelLoyerctionsTypes.GET_ALL_SMS_BY_LOCATAIRE;
  constructor(public payload: any) {}
}

export class GetAllSmsByLocataireActionsSuccess implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_ALL_SMS_BY_LOCATAIRE_SUCCES;
  constructor(public payload: any) {}
}
export class GetAllSmsByLocataireActionsError implements Action {
  type: AppelLoyerctionsTypes =
    AppelLoyerctionsTypes.GET_ALL_SMS_BY_LOCATAIRE_ERROR;
  constructor(public payload: string) {}
}
export type AppelLoyerActions =
  | SaveSupprimerActions
  | SaveSupprimerActionsError
  |SaveReductionActionsSuccess
  | SaveReductionActions
  | SaveReductionActionsError
  | SaveReductionActionsSuccess
  | GetAllAppelLoyerActions
  | GetAllAppelLoyerActionsError
  | GetAllAppelLoyerActionsSuccess
  | GetAllAppelLoyerByPeriodeActions
  | GetAllAppelLoyerByPeriodeActionsSuccess
  | GetAllAppelLoyerByPeriodeActionsError
  | GetAllAppelLoyerAnneeActions
  | GetAllAppelLoyerAnneeActionsError
  | GetImayerLoyerParAnneeActions
  | GetImayerLoyerParAnneeActionsError
  | GetImayerLoyerParAnneeActionsSuccess
  | GetPayerLoyerParAnneeActions
  | GetPayerLoyerParAnneeActionsError
  | GetPayerLoyerParAnneeActionsSuccess
  | GetImpayerLoyerParPeriodeActions
  | GetImpayerLoyerParPeriodeActionsSuccess
  | GetImpayerLoyerParPeriodeActionsError
  | GetPayerLoyerParPeriodeActions
  | GetPayerLoyerParPeriodeActionsError
  | GetPayerLoyerParPeriodeActionsSuccess
  | GetAllAppelLoyerByBailActions
  | GetAllAppelLoyerByBailActionsSuccess
  | GetAllAppelLoyerByBailActionsError
  | GetAllSmsByLocataireActions
  | GetAllSmsByLocataireActionsError
  | GetAllSmsByLocataireActionsSuccess
  |GetStatLoyerParPeriodeActions
  |GetStatLoyerParPeriodeActionsSuccess
  |GetStatLoyerParPeriodeActionsError
  |GetStatLoyerParAnneeActions
  |GetStatLoyerParAnneeActionsError
  |GetStatLoyerParAnneeActionsSuccess;
