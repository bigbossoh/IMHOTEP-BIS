import { Action } from '@ngrx/store';
import {
  QuittanceAppelLoyerActionsType,
  QuittanceAppelLoyerActions,
} from './quittance-appel-loyer.action';
export enum QuittanceloyerStateEnum {
  Ready = 'Ready',
  Requested = 'Requested',
  Started = 'Started',
  Failed = 'Failed',
  Completed = 'Completed',

}
export interface QuittanceLoyerState {
  quittance: any;
  errorMessage: string;
  dataState: QuittanceloyerStateEnum;
  progress: number | null;
}
const initState: QuittanceLoyerState = {
  quittance: null,
  errorMessage: '',
  dataState: QuittanceloyerStateEnum.Ready,
  progress:  null,
};

export function quittanceAppelReducer(
  state: QuittanceLoyerState = initState,
  action: Action
): QuittanceLoyerState {
  switch (action.type) {
    case QuittanceAppelLoyerActionsType.PRINT_RECU:
      return { ...state, dataState: QuittanceloyerStateEnum.Requested };
    case QuittanceAppelLoyerActionsType.PRINT_RECU_SUCCES:
      return {
        ...state,
        dataState: QuittanceloyerStateEnum.Started,
        quittance: (<QuittanceAppelLoyerActions>action).payload,
      };
    case QuittanceAppelLoyerActionsType.PRINT_RECU_ERROR:
      return {
        ...state,
        dataState: QuittanceloyerStateEnum.Failed,
        quittance: (<QuittanceAppelLoyerActions>action).payload,
      };
    case QuittanceAppelLoyerActionsType.PRINT_QUITTANCE:
      return { ...state, dataState: QuittanceloyerStateEnum.Requested };
    case QuittanceAppelLoyerActionsType.PRINT_QUITTANCE_SUCCES:
      return {
        ...state,
        dataState: QuittanceloyerStateEnum.Started,
        quittance: (<QuittanceAppelLoyerActions>action).payload,
      };
    case QuittanceAppelLoyerActionsType.PRINT_QUITTANCE_ERROR:
      return {
        ...state,
        dataState: QuittanceloyerStateEnum.Failed,
        quittance: (<QuittanceAppelLoyerActions>action).payload,
      };
    default:
      return { ...state };
  }
}
