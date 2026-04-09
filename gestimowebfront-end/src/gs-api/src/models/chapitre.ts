/* tslint:disable */
import { Bienimmobilier } from './bienimmobilier';
import { SuivieDepense } from './suivie-depense';
export interface Chapitre {
  id?: number;
  libelleChapitre?: string;
  biens?: Array<Bienimmobilier>;
  suivisDepenseChapitre?: Array<SuivieDepense>;
}
