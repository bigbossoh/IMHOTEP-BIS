/* tslint:disable */
import { ReservationAfficheDto } from './reservation-affiche-dto';
export interface EncaissementReservationDto {
  id?: number;
  idReservation?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  modePaiement?: string;
  operationType?: string;
  dateEncaissement?: string;
  idLastEncaissement?: number;
  montantEncaissement?: number;
  soldeEncaissement?: number;
  encienSoldReservation?: number;
  nvoSoldeReservation?: number;
  intituleDepense?: string;
  entiteOperation?: 'MAGISER' | 'SEVEINVEST';
  reservationAfficheDto?: ReservationAfficheDto;
  typePaiement?: string;
}
