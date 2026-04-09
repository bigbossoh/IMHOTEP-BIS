import { Action } from '@ngrx/store';

export enum SendQuittanceByMailActionsType {
  SEND_QUITTANCE_GROUPER_BY_MAIL = 'Quittance Groupé Send',
  SEND_QUITTANCE_GROUPER_BY_MAIL_SUCCES = 'Quittance Groupé Send succes',
  SEND_QUITTANCE_GROUPER_BY_MAIL_ERROR = 'Quittance Groupé Send error',

  SEND_QUITTANCE_INDIVIDUEL = 'Quittance Individuel Send',
  SEND_QUITTANCE_INDIVIDUEL_SUCCES = '[Quittance Individuel Send succes',
  SEND_QUITTANCE_INDIVIDUEL_ERROR = 'Quittance Individuel Send error',
}
//SEND MAIL GROUPER
export class SendQuittanceByMailActions implements Action {
  type: SendQuittanceByMailActionsType =
    SendQuittanceByMailActionsType.SEND_QUITTANCE_GROUPER_BY_MAIL;
  constructor(public payload: any) {}
}

export class SendQuittanceByMailActionsSuccess implements Action {
  type: SendQuittanceByMailActionsType =
    SendQuittanceByMailActionsType.SEND_QUITTANCE_GROUPER_BY_MAIL_SUCCES;
  constructor(public payload: boolean) {}
}
export class SendQuittanceByMailActionsError implements Action {
  type: SendQuittanceByMailActionsType =
    SendQuittanceByMailActionsType.SEND_QUITTANCE_GROUPER_BY_MAIL_ERROR;
  constructor(public payload: string) {}
}
//SEND MAIL INDIVIDUEL
export class SendQuittanceIndividuelActions implements Action {
  type: SendQuittanceByMailActionsType =
    SendQuittanceByMailActionsType.SEND_QUITTANCE_INDIVIDUEL;
  constructor(public payload: number) {}
}

export class SendQuittanceIndividuelActionsSuccess implements Action {
  type: SendQuittanceByMailActionsType =
    SendQuittanceByMailActionsType.SEND_QUITTANCE_INDIVIDUEL_SUCCES;
  constructor(public payload: boolean) {}
}
export class SendQuittanceIndividuelActionsError implements Action {
  type: SendQuittanceByMailActionsType =
    SendQuittanceByMailActionsType.SEND_QUITTANCE_INDIVIDUEL_ERROR;
  constructor(public payload: string) {}
}

export type SendMailActions =
  | SendQuittanceByMailActions
  | SendQuittanceByMailActionsSuccess
  | SendQuittanceByMailActionsError
  | SendQuittanceIndividuelActionsError
  | SendQuittanceIndividuelActions
  | SendQuittanceIndividuelActionsSuccess;
