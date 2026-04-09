/* tslint:disable */
import { Quartier } from './quartier';
import { Bienimmobilier } from './bienimmobilier';
export interface Site {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  abrSite?: string;
  nomSite?: string;
  quartier?: Quartier;
  bienImmobiliers?: Array<Bienimmobilier>;
}
