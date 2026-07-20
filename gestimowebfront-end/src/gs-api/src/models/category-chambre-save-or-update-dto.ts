/* tslint:disable */
import { PrixParCategorieChambreDto } from './prix-par-categorie-chambre-dto';
import { AppartementDto } from './appartement-dto';
export interface CategoryChambreSaveOrUpdateDto {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  name: string;
  description: string;
  prixParHeureJour?: number;
  prixParHeureNuit?: number;
  prixGategorieDto?: Array<PrixParCategorieChambreDto>;
  appartements?: Array<AppartementDto>;
}
