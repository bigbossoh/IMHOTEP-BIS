/* tslint:disable */
export interface EncaissementReservationRequestDto {
  idReservation?: number;
  idAgence?: number;
  idCreateur?: number;
  modePaiement?: string;
  dateEncaissement?: string;
  montantEncaissement?: number;
  encienSoldReservation?: number;
  nvoSoldeReservation?: number;
  idAppartement?: number;
}
