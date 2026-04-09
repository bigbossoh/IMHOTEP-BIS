/* tslint:disable */
import { Utilisateur } from './utilisateur';
import { AppelLoyer } from './appel-loyer';
export interface Encaissement {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  dateEncaissement?: string;
  montantEncaissement?: number;
  utilisateurEncaissement?: Utilisateur;
  appelLoyerEncaissement?: AppelLoyer;
}
