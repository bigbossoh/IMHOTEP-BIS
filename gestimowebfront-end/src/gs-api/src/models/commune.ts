/* tslint:disable */
import { Ville } from './ville';
import { Quartier } from './quartier';
export interface Commune {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  abrvCommune?: string;
  nomCommune?: string;
  ville?: Ville;
  quartiers?: Array<Quartier>;
}
