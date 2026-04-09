/* tslint:disable */
import { BailLocation } from './bail-location';
export interface Charges {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  typeCharge?: number;
  debutCharge?: string;
  finCharge?: string;
  montantCharge?: number;
  augmentationCharge?: number;
  tauxCharge?: number;
  bailLocataireCharge?: BailLocation;
}
