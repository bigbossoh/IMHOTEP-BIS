/* tslint:disable */
import { BailLocation } from './bail-location';
export interface MontantLoyerBail {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  ancienMontantLoyer?: number;
  nouveauMontantLoyer?: number;
  debutLoyer?: string;
  finLoyer?: string;
  statusLoyer?: boolean;
  tauxLoyer?: number;
  montantAugmentation?: number;
  bailLocation?: BailLocation;
}
