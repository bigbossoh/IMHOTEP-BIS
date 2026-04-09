/* tslint:disable */
export interface OperationDto {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  idFirstAppel?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  dateDebut?: string;
  dateFin?: string;
  utilisateurOperation?: string;
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
}
