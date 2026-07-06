/* tslint:disable */
export interface FneFactureCertificationDto {
  id?: number;
  dateCertification?: string;
  typeDocument?: string;
  idReservation?: number;
  factureNumero?: string;
  clientNom?: string;
  etablissement?: string;
  pointOfSale?: string;
  modePaiement?: string;
  montant?: number;
  certifiee?: boolean;
  fneReference?: string;
  fneNcc?: string;
  fneVerificationUrl?: string;
  fneBalanceSticker?: number;
  fneWarning?: boolean;
  messageErreur?: string;
}
