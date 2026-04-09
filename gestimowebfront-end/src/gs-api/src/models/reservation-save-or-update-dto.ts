/* tslint:disable */
import { UtilisateurRequestDto } from './utilisateur-request-dto';
export interface ReservationSaveOrUpdateDto {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  utilisateurRequestDto?: UtilisateurRequestDto;
  idAppartementdDto?: number;
  idUtilisateur?: number;
  dateDebut?: string;
  dateFin?: string;
  bienImmobilierOperation?: string;
  designationBail?: string;
  abrvCodeBail?: string;
  enCoursBail?: boolean;
  archiveBail?: boolean;
  montantCautionBail?: number;
  nbreMoisCautionBail?: number;
  nouveauMontantLoyer?: number;
  idBienImmobilier?: number;
  idLocataire?: number;
  codeAbrvBienImmobilier?: string;
  pourcentageReduction?: number;
  montantReduction?: number;
  soldReservation?: number;
  montantPaye?: number;
  nmbreAdulte?: number;
  montantReservation?: number;
  nmbrEnfant?: number;
}
