/* tslint:disable */
export interface BienImmobilierAffiheDto {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  codeAbrvBienImmobilier?: string;
  nomCompletBienImmobilier?: string;
  nomBaptiserBienImmobilier?: string;
  description?: string;
  superficieBien?: number;
  bienMeublerResidence?: boolean;
  nomPrenomProprio?: string;
  chapitre?: string;
  occupied?: boolean;
}
