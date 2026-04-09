/* tslint:disable */
export interface MagasinResponseDto {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  nombrePieceMagasin?: number;
  numMagasin?: number;
  codeAbrvBienImmobilier?: string;
  nomCompletBienImmobilier?: string;
  nomBaptiserBienImmobilier?: string;
  description?: string;
  superficieBien?: number;
  bienMeublerResidence?: boolean;
  proprietaire?: string;
  underBuildingMagasin?: boolean;
  occupied?: boolean;
}
