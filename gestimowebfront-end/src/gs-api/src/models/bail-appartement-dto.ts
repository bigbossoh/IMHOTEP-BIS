/* tslint:disable */
export interface BailAppartementDto {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  designationBail?: string;
  abrvCodeBail?: string;
  enCoursBail?: boolean;
  archiveBail?: boolean;
  montantCautionBail?: number;
  nbreMoisCautionBail?: number;
  nouveauMontantLoyer?: number;
  dateDebut?: string;
  dateFin?: string;
  idAppartement?: number;
  idLocataire?: number;
  nomLocataire?: string;
  idBienImmobilier?: number;
  codeBien?: string;
}
