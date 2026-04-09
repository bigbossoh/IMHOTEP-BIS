/* tslint:disable */
import { Ville } from './ville';
export interface Pays {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  abrvPays?: string;
  nomPays?: string;
  villes?: Array<Ville>;
}
