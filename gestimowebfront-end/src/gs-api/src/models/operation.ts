/* tslint:disable */
import { Utilisateur } from './utilisateur';
import { Bienimmobilier } from './bienimmobilier';
export interface Operation {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  dateDebut?: string;
  dateFin?: string;
  utilisateurOperation?: Utilisateur;
  bienImmobilierOperation?: Bienimmobilier;
}
