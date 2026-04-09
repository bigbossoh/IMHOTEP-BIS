/* tslint:disable */
import { Chapitre } from './chapitre';
export interface SuivieDepense {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  dateEncaissement?: string;
  designation?: string;
  codeTransaction?: string;
  montantDepense?: number;
  modePaiement?: 'ESPESE_MAGISER' | 'ESPECE_SEVEINVEST' | 'CHEQUE_ECOBANK_MAGISER' | 'CHEQUE_GTBANK_SEVEINVEST' | 'VIREMENT_ECOBANK_MAGISER' | 'VIREMENT_GTBANK_SEVEINVEST' | 'MOBILE_MONEY_MAGISER' | 'MOBILE_MONEY_SEVEINVEST';
  operationType?: 'CREDIT' | 'DEBIT';
  chapitreSuivis?: Chapitre;
}
