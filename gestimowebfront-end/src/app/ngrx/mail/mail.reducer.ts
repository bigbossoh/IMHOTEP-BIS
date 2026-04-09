import { state } from '@angular/animations';
import { Action } from '@ngrx/store';
import { SendMailActions, SendQuittanceByMailActionsType } from './mail.action';

export enum MailStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
}

export interface MailState {
  mails: boolean;
  errorMessage: string;
  dataState: MailStateEnum;
}
const initState: MailState = {
  mails: false,
  errorMessage: '',
  dataState: MailStateEnum.LOADING,
};
export function mailReducer(
  state: MailState = initState,
  action: Action
): MailState {
  switch (action.type) {
   //SEND MAIL GROUPER
    case SendQuittanceByMailActionsType.SEND_QUITTANCE_GROUPER_BY_MAIL:
      return { ...state, dataState: MailStateEnum.INITIAL };
    case SendQuittanceByMailActionsType.SEND_QUITTANCE_GROUPER_BY_MAIL_SUCCES:
      return {
        ...state,
        dataState: MailStateEnum.LOADED,
        mails: (<SendMailActions>action).payload,
      };
    case SendQuittanceByMailActionsType.SEND_QUITTANCE_GROUPER_BY_MAIL_ERROR:
      return {
        ...state,
        dataState: MailStateEnum.ERROR,
        mails: (<SendMailActions>action).payload,
      };

      //SEND MAIL INDIVIDUEL
      case SendQuittanceByMailActionsType.SEND_QUITTANCE_INDIVIDUEL:
        return { ...state, dataState: MailStateEnum.INITIAL };
      case SendQuittanceByMailActionsType.SEND_QUITTANCE_INDIVIDUEL_SUCCES:
        return {
          ...state,
          dataState: MailStateEnum.LOADED,
          mails: (<SendMailActions>action).payload,
        };
      case SendQuittanceByMailActionsType.SEND_QUITTANCE_INDIVIDUEL_ERROR:
        return {
          ...state,
          dataState: MailStateEnum.ERROR,
          mails: (<SendMailActions>action).payload,
      };
    
    default:
      return { ...state };
  }
}
