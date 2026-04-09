/* tslint:disable */
export interface ClotureCaisseDto {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  totalEncaisse?: number;
  chapitreCloture?: string;
  dateDeDCloture?: string;
  intervalNextCloture?: number;
  dateFinCloture?: string;
  caissiere?: string;
  dateNextCloture?: string;
}
