/* tslint:disable */
import { Bienimmobilier } from './bienimmobilier';
export interface ImageData {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  nameImage?: string;
  typeImage?: string;
  profileAgenceImageUrl?: string;
  imageData?: Array<string>;
  bienimmobilier?: Bienimmobilier;
}
