/* tslint:disable */
import { CommuneResponseDto } from './commune-response-dto';
export interface QuartierResponseDto {
  id?: number;
  abrvQuartier?: string;
  nomQuartier?: string;
  communeResponseDto?: CommuneResponseDto;
  idAgence?: number;
}
