/* tslint:disable */
import { Utilisateur } from './utilisateur';
export interface Role {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  roleName?: string;
  descriptionRole?: string;
  utilisateurs?: Array<Utilisateur>;
}
