/* tslint:disable */
export interface LocataireEncaisDTO {
  id?: number;
  idBien?: number;
  idBail?: number;
  idAppel?: number;
  montantloyer?: number;
  mois?: string;
  moisEnLettre?: string;
  nom?: string;
  prenom?: string;
  codeDescBail?: string;
  username?: string;
  soldeAppelLoyer?: number;
  unlock?: boolean;
  bailEnCours?: boolean;
  statutBail?: string;
  dateClotureBail?: string;
}
