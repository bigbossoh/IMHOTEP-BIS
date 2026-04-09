/* tslint:disable */
export interface MontantLoyerBailDto {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  ancienMontantLoyer?: number;
  nouveauMontantLoyer?: number;
  debutLoyer?: string;
  finLoyer?: string;
  statusLoyer?: boolean;
  tauxLoyer?: number;
  montantAugmentation?: number;
  bailLocation?: number;
}
