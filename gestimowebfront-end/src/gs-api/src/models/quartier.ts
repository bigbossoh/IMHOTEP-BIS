/* tslint:disable */
import { Commune } from './commune';
import { Site } from './site';
export interface Quartier {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  abrvQuartier?: string;
  nomQuartier?: string;
  commune?: Commune;
  sites?: Array<Site>;
}
