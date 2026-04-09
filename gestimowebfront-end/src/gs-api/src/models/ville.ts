/* tslint:disable */
import { Pays } from './pays';
import { Commune } from './commune';
export interface Ville {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  abrvVille?: string;
  nomVille?: string;
  pays?: Pays;
  communes?: Array<Commune>;
}
