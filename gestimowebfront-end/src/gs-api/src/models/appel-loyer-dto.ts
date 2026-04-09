/* tslint:disable */
export interface AppelLoyerDto {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  periodeAppelLoyer?: string;
  statusAppelLoyer?: string;
  datePaiementPrevuAppelLoyer?: string;
  dateDebutMoisAppelLoyer?: string;
  dateFinMoisAppelLoyer?: string;
  anneeAppelLoyer?: number;
  moisChiffreAppelLoyer?: number;
  descAppelLoyer?: string;
  soldeAppelLoyer?: number;
  montantBailLPeriode?: number;
  bailLocationAppelLoyer?: number;
  solderAppelLoyer?: boolean;
}
