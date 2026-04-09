/* tslint:disable */
export interface ReservationRequestDto {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  idAppartementdDto?: number;
  dateDebut?: string;
  dateFin?: string;
  idClient?: number;
  idBien?: number;
  idUtilisateur?: number;
  nom?: string;
  prenom?: string;
  username?: string;
  pourcentageReduction?: number;
  montantReduction?: number;
  soldReservation?: number;
  montantPaye?: number;
  montantReservation?: number;
  montantDeReservation?: number;
  nmbreAdulte?: number;
  nmbrEnfant?: number;
}
