export interface ExpenseHistory {
  id?: number;
  validationLevel?: number;
  actionType?: string;
  workflowStatusAfterAction?: string;
  actorUserId?: number;
  actorName?: string;
  actorRoleName?: string;
  commentaire?: string;
  actionAt?: string;
}

export interface ExpenseRecord {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  dateEncaissement?: string;
  designation?: string;
  referenceDepense?: string;
  categorieDepense?: string;
  libelleDepense?: string;
  descriptionDepense?: string;
  codeTransaction?: string;
  montantDepense?: number;
  modePaiement?: string;
  operationType?: string;
  cloturerSuivi?: string;
  idChapitre?: number;
  statutPaiement?: string;
  datePaiement?: string;
  bienImmobilierId?: number;
  bienImmobilierCode?: string;
  bienImmobilierLibelle?: string;
  typeBienImmobilier?: string;
  appartementLocalId?: number;
  appartementLocalLibelle?: string;
  fournisseurNom?: string;
  fournisseurTelephone?: string;
  fournisseurEmail?: string;
  justificatifNom?: string;
  justificatifType?: string;
  hasJustificatif?: boolean;
  workflowStatus?: string;
  currentValidationLevel?: number;
  maxValidationLevel?: number;
  workflowRequired?: boolean;
  demandeurId?: number;
  demandeurNom?: string;
  submittedAt?: string;
  validatedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
  validationNiveau1Label?: string;
  validationNiveau1Role?: string;
  validationNiveau1UserId?: number;
  validationNiveau1UserName?: string;
  validationNiveau2Label?: string;
  validationNiveau2Role?: string;
  validationNiveau2UserId?: number;
  validationNiveau2UserName?: string;
  validationNiveau3Label?: string;
  validationNiveau3Role?: string;
  validationNiveau3UserId?: number;
  validationNiveau3UserName?: string;
  history?: ExpenseHistory[];
}

export interface ExpenseSupplierSuggestion {
  fournisseurNom?: string;
  fournisseurTelephone?: string;
  fournisseurEmail?: string;
}

export interface ExpenseWorkflowLevel {
  levelOrder: number;
  levelLabel: string;
  validatorRoleName?: string | null;
  validatorUserId?: number | null;
  validatorUserDisplayName?: string | null;
  active: boolean;
}

export interface ExpenseWorkflowConfig {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  active: boolean;
  validationThreshold: number;
  levelCount: number;
  categories: string[];
  paymentModes: string[];
  levels: ExpenseWorkflowLevel[];
}

export interface ExpenseActionPayload {
  utilisateurId?: number;
  utilisateurNom?: string;
  utilisateurRole?: string;
  commentaire?: string;
}

export interface ExpenseFormPayload {
  id?: number | null;
  idAgence: number;
  idCreateur: number;
  demandeurNom?: string;
  action: 'BROUILLON' | 'SOUMETTRE';
  referenceDepense: string;
  dateEncaissement: string;
  categorieDepense: string;
  libelleDepense: string;
  descriptionDepense?: string;
  montantDepense: number;
  modePaiement: string;
  statutPaiement: string;
  datePaiement?: string | null;
  bienImmobilierId: number;
  bienImmobilierCode?: string;
  bienImmobilierLibelle?: string;
  typeBienImmobilier?: string;
  appartementLocalId?: number | null;
  appartementLocalLibelle?: string;
  fournisseurNom?: string;
  fournisseurTelephone?: string;
  fournisseurEmail?: string;
  idChapitre?: number | null;
}
