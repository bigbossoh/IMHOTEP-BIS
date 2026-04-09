/* tslint:disable */
import { Utilisateur } from './utilisateur';
import { Chapitre } from './chapitre';
import { ImageData } from './image-data';
import { Site } from './site';
export interface Bienimmobilier {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  codeAbrvBienImmobilier?: string;
  nomCompletBienImmobilier?: string;
  nomBaptiserBienImmobilier?: string;
  description?: string;
  superficieBien?: number;
  bienMeublerResidence?: boolean;
  utilisateurProprietaire?: Utilisateur;
  nombrePieceBien?: number;
  chapitre?: Chapitre;
  imageDatas?: Array<ImageData>;
  site?: Site;
  occupied?: boolean;
}
