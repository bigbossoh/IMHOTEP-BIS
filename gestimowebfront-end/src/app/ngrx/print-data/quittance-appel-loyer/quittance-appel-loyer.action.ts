import { Action } from '@ngrx/store';

export enum QuittanceAppelLoyerActionsType {
  PRINT_QUITTANCE = '[quittance_appel_loyer] load quittance',
  PRINT_QUITTANCE_SUCCES = '[quittance_appel_loyer] load quittance succes',
  PRINT_QUITTANCE_ERROR = '[quittance_appel_loyer] load quittance error',
  PRINT_RECU = 'load quittance',
  PRINT_RECU_SUCCES = ' load quittance succes',
  PRINT_RECU_ERROR = ' load quittance error',
}

export class PrintQuittanceLoyerActions implements Action {
  type: QuittanceAppelLoyerActionsType =
    QuittanceAppelLoyerActionsType.PRINT_QUITTANCE;
  constructor(public payload: any) {}
}

export class PrintQuittanceLoyerActionsSuccess implements Action {
  type: QuittanceAppelLoyerActionsType =
    QuittanceAppelLoyerActionsType.PRINT_QUITTANCE_SUCCES;
  constructor(public payload: any) {}
}
export class PrintQuittanceLoyerActionsError implements Action {
  type: QuittanceAppelLoyerActionsType =
    QuittanceAppelLoyerActionsType.PRINT_QUITTANCE_ERROR;
  constructor(public payload: string) {}
}


export class PrintRecuLoyerActions implements Action {
  type: QuittanceAppelLoyerActionsType =
    QuittanceAppelLoyerActionsType.PRINT_RECU;
  constructor(public payload: any) {}
}

export class PrintRecuLoyerActionsSuccess implements Action {
  type: QuittanceAppelLoyerActionsType =
    QuittanceAppelLoyerActionsType.PRINT_RECU_SUCCES;
  constructor(public payload: any) {}
}
export class PrintRecuLoyerActionsError implements Action {
  type: QuittanceAppelLoyerActionsType =
    QuittanceAppelLoyerActionsType.PRINT_RECU_ERROR;
  constructor(public payload: string) {}
}
export type QuittanceAppelLoyerActions =
  | PrintQuittanceLoyerActions
  | PrintQuittanceLoyerActionsSuccess
  | PrintQuittanceLoyerActionsError
  |PrintRecuLoyerActions
  |PrintRecuLoyerActionsError
  PrintRecuLoyerActionsSuccess;
