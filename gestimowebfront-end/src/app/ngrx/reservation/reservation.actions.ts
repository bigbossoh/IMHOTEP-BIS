import { Action } from '@ngrx/store';

export enum ReservationActionTypes {
  GET_LISTE_RESERVATION = '[ReservationAfficheDto] Get LISTE RESERVATION Pour encaissement',
  GET_LISTE_RESERVATION_SUCCES = '[ReservationAfficheDto] Get LISTE RESERVATION Pour encaissement Succes',
  GET_LISTE_RESERVATION_ERROR = '[ReservationAfficheDto] Get LISTE RESERVATION Pour encaissement Error',

  SAVE_RESERVATION = '[ReservationAfficheDto] SAVE  RESERVATION Pour encaissement',
  SAVE_RESERVATION_SUCCES = '[ReservationAfficheDto] SAVE  RESERVATION Pour encaissement Succes',
  SAVE_RESERVATION_ERROR = '[ReservationAfficheDto] SAVE  RESERVATION Pour encaissement Error',

  GET_LISTE_RESERVATION_OUVERT = '[ReservationAfficheDto] Get LISTE RESERVATION Pour encaissement OUV',
  GET_LISTE_RESERVATION_OUVERT_SUCCES = '[ReservationAfficheDto] Get LISTE RESERVATION Pour encaissement Succes OUV',
  GET_LISTE_RESERVATION_OUVERT_ERROR = '[ReservationAfficheDto] Get LISTE RESERVATION Pour encaissement Error OUV',

  SAVE_ENCAISSEMENT_RESERVATION = '[ReservationAfficheDto] SAVE ENCAISSEMENT_  RESERVATION Pour encaissement',
  SAVE_ENCAISSEMENT_RESERVATION_SUCCES = '[ReservationAfficheDto] SAVE ENCAISSEMENT_ RESERVATION Pour encaissement Succes',
  SAVE_ENCAISSEMENT_RESERVATION_ERROR = '[ReservationAfficheDto] SAVE ENCAISSEMENT_ RESERVATION Pour encaissement Error',

  GET_LISTE_ENCAISSEMENT_RESERVATION_BIEN = '[ReservationAfficheDto] Get LISTE RESERVATION Pour encaissement _BIEN',
  GET_LISTE_ENCAISSEMENT_RESERVATION_BIEN_SUCCES = '[ReservationAfficheDto] Get LISTE RESERVATION Pour encaissement _BIEN Succes',
  GET_LISTE_ENCAISSEMENT_RESERVATION_BIEN_ERROR = '[ReservationAfficheDto] Get LISTE RESERVATION Pour encaissement _BIEN Error',
}
export class GetListReservationAction implements Action {
  type: ReservationActionTypes = ReservationActionTypes.GET_LISTE_RESERVATION;
  constructor(public payload: any) {}
}

export class GetListReservationActionsSuccess implements Action {
  type: ReservationActionTypes =
    ReservationActionTypes.GET_LISTE_RESERVATION_SUCCES;
  constructor(public payload: any) {}
}
export class GetListReservationActionsError implements Action {
  type: ReservationActionTypes =
    ReservationActionTypes.GET_LISTE_RESERVATION_ERROR;
  constructor(public payload: string) {}
}

export class SaveReservationAction implements Action {
  type: ReservationActionTypes = ReservationActionTypes.SAVE_RESERVATION;
  constructor(public payload: any) {}
}

export class SaveReservationActionsSuccess implements Action {
  type: ReservationActionTypes = ReservationActionTypes.SAVE_RESERVATION_SUCCES;
  constructor(public payload: any) {}
}
export class SaveReservationActionsError implements Action {
  type: ReservationActionTypes = ReservationActionTypes.SAVE_RESERVATION_ERROR;
  constructor(public payload: string) {}
}

export class GetListReservationOuvertAction implements Action {
  type: ReservationActionTypes =
    ReservationActionTypes.GET_LISTE_RESERVATION_OUVERT;
  constructor(public payload: any) {}
}

export class GetListReservationOuvertActionsSuccess implements Action {
  type: ReservationActionTypes =
    ReservationActionTypes.GET_LISTE_RESERVATION_OUVERT_SUCCES;
  constructor(public payload: any) {}
}
export class GetListReservationOuvertActionsError implements Action {
  type: ReservationActionTypes =
    ReservationActionTypes.GET_LISTE_RESERVATION_OUVERT_ERROR;
  constructor(public payload: string) {}
}

export class SaveEncaissementReservationAction implements Action {
  type: ReservationActionTypes =
    ReservationActionTypes.SAVE_ENCAISSEMENT_RESERVATION;
  constructor(public payload: any) {}
}

export class SaveEncaissementReservationActionsSuccess implements Action {
  type: ReservationActionTypes =
    ReservationActionTypes.SAVE_ENCAISSEMENT_RESERVATION_SUCCES;
  constructor(public payload: any) {}
}
export class SaveEncaissementReservationActionsError implements Action {
  type: ReservationActionTypes =
    ReservationActionTypes.SAVE_ENCAISSEMENT_RESERVATION_ERROR;
  constructor(public payload: string) {}
}
export class GetListEncaissementReservationBienAction implements Action {
  type: ReservationActionTypes =
    ReservationActionTypes.GET_LISTE_ENCAISSEMENT_RESERVATION_BIEN;
  constructor(public payload: any) {}
}

export class GetListEncaissementReservationBienActionSuccess implements Action {
  type: ReservationActionTypes =
    ReservationActionTypes.GET_LISTE_ENCAISSEMENT_RESERVATION_BIEN_SUCCES;
  constructor(public payload: any) {}
}
export class GetListEncaissementReservationBienActionError implements Action {
  type: ReservationActionTypes =
    ReservationActionTypes.GET_LISTE_ENCAISSEMENT_RESERVATION_BIEN_ERROR;
  constructor(public payload: string) {}
}
export type ReservationActions =
  | GetListReservationAction
  | GetListReservationActionsSuccess
  | GetListReservationActionsError
  | SaveReservationAction
  | SaveReservationActionsError
  | SaveReservationActionsSuccess
  | GetListReservationOuvertAction
  | GetListReservationOuvertActionsError
  | GetListReservationOuvertActionsSuccess
  | SaveEncaissementReservationAction
  | SaveEncaissementReservationActionsError
  | SaveEncaissementReservationActionsSuccess
  | GetListEncaissementReservationBienAction
  | GetListEncaissementReservationBienActionError
  | GetListEncaissementReservationBienActionSuccess;
