import { formatDate } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { GetAllAppartementMeubleActions } from './../../../ngrx/appartement/appartement.actions';
import {
  AppartementState,
  AppartementStateEnum,
} from 'src/app/ngrx/appartement/appartement.reducer';
import {
  ReservationState,
  ReservationStateEnum,
} from 'src/app/ngrx/reservation/reservation.reducer';
import { GetAllClientHotelActions } from 'src/app/ngrx/utulisateur/gerant/gerant.actions';
import {
  GerantState,
  GerantStateEnum,
} from 'src/app/ngrx/utulisateur/gerant/gerant.reducer';
import { UserService } from 'src/app/services/user/user.service';
import {
  AppartementDto,
  PrixParCategorieChambreDto,
  PrestationAdditionnelReservationSaveOrrUpdate,
  PrestationSaveOrUpdateDto,
  ReservationAfficheDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';
import { SaveReservationAction } from 'src/app/ngrx/reservation/reservation.actions';
import { DialogData } from '../../baux/page-baux/page-baux.component';
import { PageNewUtilisateurComponent } from '../../utilisateurs/page-new-utilisateur/page-new-utilisateur.component';

type ReservationMode = 1 | 2;

@Component({
  standalone: false,
  selector: 'app-page-ajout-reservation',
  templateUrl: './page-ajout-reservation.component.html',
  styleUrls: ['./page-ajout-reservation.component.css'],
})
export class PageAjoutReservationComponent implements OnInit, OnDestroy {
  encaissementform?: FormGroup;
  reservationState$: Observable<ReservationState> | null = null;
  gerantState$: Observable<GerantState> | null = null;
  appartementState$: Observable<AppartementState> | null = null;

  readonly GerantStateEnum = GerantStateEnum;
  readonly ReservationStateEnum = ReservationStateEnum;
  readonly AppartementStateEnum = AppartementStateEnum;

  readonly reservationModes: Array<{
    value: ReservationMode;
    title: string;
    description: string;
  }> = [
    {
      value: 1,
      title: 'Pré-réservation',
      description:
        'Bloquer une chambre rapidement, même si le client n’est pas encore entièrement renseigné.',
    },
    {
      value: 2,
      title: 'Entrée en chambre',
      description:
        'Associer un client, définir le séjour et enregistrer immédiatement le paiement.',
    },
  ];

  client: ReservationMode = 1;
  idReservation = 0;
  totalApayer = 0;
  resteApayer = 0;
  reduction = 0;
  montantPayer = 0;
  nbrAdult = 1;
  nbrEnfant = 0;
  dateDebutSejour: Date | null = null;
  dateFinSejour: Date | null = null;
  dateDiff = 0;
  laNuiteMontant = 0;
  listMontant: PrixParCategorieChambreDto[] = [];
  residenceModel: AppartementDto | null = null;
  selectedClient: UtilisateurRequestDto | null = null;
  public user?: UtilisateurRequestDto;
  public minDate: Date = new Date();

  private reservationToEdit: ReservationAfficheDto | null = null;
  private appartementSubscription?: Subscription;
  private clientSubscription?: Subscription;
  private prestationsSubscription?: Subscription;
  private prestationsLinkSubscription?: Subscription;

  prestations: PrestationSaveOrUpdateDto[] = [];
  filteredPrestations: PrestationSaveOrUpdateDto[] = [];
  prestationSearch = '';
  prestationsLoading = false;
  prestationsError = '';
  selectedPrestationIds = new Set<number>();

  constructor(
    public dialogRef: MatDialogRef<PageAjoutReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store<any>,
    private userService: UserService,
    private apiService: ApiService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  get dialogTitle(): string {
    return this.idReservation ? 'Mettre à jour une réservation' : 'Ajout réservation';
  }

  get dialogSubtitle(): string {
    return this.isCheckInMode
      ? 'Finaliser l’arrivée, associer le client et enregistrer les montants.'
      : 'Créer une réservation de chambre avec une expérience plus claire et plus rapide.';
  }

  get isCheckInMode(): boolean {
    return Number(this.client) === 2;
  }

  get selectedModeDescription(): string {
    return this.reservationModes.find((mode) => mode.value === Number(this.client))
      ?.description ?? '';
  }

  get selectedRoomName(): string {
    return (
      this.residenceModel?.nomBaptiserBienImmobilier ||
      this.reservationToEdit?.bienImmobilierOperation ||
      'Aucune chambre sélectionnée'
    );
  }

  get selectedRoomCategory(): string {
    return (
      this.residenceModel?.idCategorieChambre?.name ||
      this.residenceModel?.nameCategorie ||
      this.reservationToEdit?.descriptionCategori ||
      'Catégorie à définir'
    );
  }

  get selectedRoomDescription(): string {
    return (
      this.residenceModel?.idCategorieChambre?.description ||
      this.residenceModel?.description ||
      'Choisis une chambre pour afficher les détails et les tarifs.'
    );
  }

  get selectedRoomRates(): PrixParCategorieChambreDto[] {
    return this.residenceModel?.idCategorieChambre?.prixGategorieDto ?? [];
  }

  get selectedClientName(): string {
    if (this.selectedClient) {
      const fullName = `${this.selectedClient.nom ?? ''} ${this.selectedClient.prenom ?? ''}`.trim();
      return fullName || this.selectedClient.username || 'Client sélectionné';
    }

    if (this.hasExistingGuest()) {
      return this.reservationToEdit?.utilisateurOperation ?? 'Client existant';
    }

    return 'Aucun client sélectionné';
  }

  get selectedClientHint(): string {
    if (this.selectedClient?.username) {
      return this.selectedClient.username;
    }

    if (this.reservationToEdit?.username && this.hasExistingGuest()) {
      return this.reservationToEdit.username;
    }

    return this.isCheckInMode
      ? 'La sélection du client est recommandée avant validation.'
      : 'Le client peut être ajouté plus tard.';
  }

  get subtotalAmount(): number {
    return this.stayNights * this.nightlyPrice;
  }

  get reductionAmount(): number {
    return (this.subtotalAmount * this.reductionPercent) / 100;
  }

  get totalAmountPreview(): number {
    if (this.totalApayer > 0) {
      return this.toNumber(this.totalApayer);
    }

    return Math.max(this.subtotalAmount - this.reductionAmount, 0);
  }

  get balanceAmountPreview(): number {
    if (this.resteApayer > 0) {
      return Math.max(this.toNumber(this.resteApayer) - this.amountPaid, 0);
    }

    return Math.max(this.totalAmountPreview - this.amountPaid, 0);
  }

  get stayNights(): number {
    return Math.max(this.toNumber(this.dateDiff), 0);
  }

  get nightlyPrice(): number {
    return this.toNumber(this.laNuiteMontant);
  }

  get reductionPercent(): number {
    return Math.max(this.toNumber(this.reduction), 0);
  }

  get amountPaid(): number {
    return Math.max(this.toNumber(this.montantPayer), 0);
  }

  get submitButtonLabel(): string {
    return this.isCheckInMode
      ? 'Valider l’entrée en chambre'
      : 'Enregistrer la pré-réservation';
  }

  get canSubmit(): boolean {
    const hasDates = !!this.dateDebutSejour && !!this.dateFinSejour && this.stayNights > 0;
    const hasRoom = !!this.residenceModel;
    const hasPrice = this.nightlyPrice > 0 || this.totalAmountPreview > 0;
    const hasGuest = !this.isCheckInMode || !!this.resolveGuestUsername();

    return hasDates && hasRoom && hasPrice && hasGuest;
  }

  get selectedPrestationsCount(): number {
    return this.selectedPrestationIds.size;
  }

  get selectedPrestationsTotal(): number {
    return this.selectedPrestations.reduce((sum, prestation) => sum + this.toNumber(prestation.amount), 0);
  }

  get selectedPrestations(): PrestationSaveOrUpdateDto[] {
    if (!this.selectedPrestationIds.size) {
      return [];
    }

    return this.prestations.filter((prestation) =>
      this.selectedPrestationIds.has(this.toNumber(prestation.id))
    );
  }

  ngOnInit(): void {
    this.resetFormState();
    this.hydrateReservationIfNeeded();
    this.user = this.userService.getUserFromLocalCache();
    this.reservationState$ = this.store.pipe(map((state) => state.reservationState));
    this.gerantState$ = this.store.pipe(map((state) => state.gerantState));
    this.appartementState$ = this.store.pipe(map((state) => state.appartementState));

    if (this.user?.idAgence) {
      this.store.dispatch(new GetAllClientHotelActions(this.user.idAgence));
      this.store.dispatch(new GetAllAppartementMeubleActions(this.user.idAgence));
    }

    this.bindAppartements();
    this.bindClients();

    this.loadPrestationsCatalogue();
    this.loadPrestationsLinks();
  }

  ngOnDestroy(): void {
    this.appartementSubscription?.unsubscribe();
    this.clientSubscription?.unsubscribe();
    this.prestationsSubscription?.unsubscribe();
    this.prestationsLinkSubscription?.unsubscribe();
  }

  ajoutClient(): void {
    const dialogRef = this.dialog.open(PageNewUtilisateurComponent, {
      width: '72vw',
      maxWidth: '960px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.user = this.userService.getUserFromLocalCache();
      if (this.user?.idAgence) {
        this.store.dispatch(new GetAllClientHotelActions(this.user.idAgence));
      }
    });
  }

  onModeChange(mode: ReservationMode): void {
    this.client = Number(mode) as ReservationMode;
  }

  onRoomSelection(room: AppartementDto | null): void {
    this.residenceModel = room;
    this.selectMontantLoyer(room?.idCategorieChambre?.prixGategorieDto);

    if (this.stayNights > 0) {
      this.getMontantNuite(this.stayNights, this.listMontant);
      return;
    }

    this.laNuiteMontant = this.toNumber(room?.priceCategorie);
  }

  onStayChange(): void {
    if (!this.dateDebutSejour || !this.dateFinSejour) {
      this.dateDiff = 0;
      this.laNuiteMontant = 0;
      return;
    }

    this.getDiffDays(this.dateDebutSejour, this.dateFinSejour);
    this.getMontantNuite(this.stayNights, this.listMontant);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitReservation(): void {
    if (!this.canSubmit || !this.user || !this.residenceModel) {
      return;
    }

    const reservationPayload = this.buildReservationPayload();
    const prestationIds = Array.from(this.selectedPrestationIds.values());

    this.encaissementform = this.fb.group(reservationPayload);
    this.store.dispatch(
      new SaveReservationAction({
        reservation: this.encaissementform.value,
        prestationIds,
      })
    );
    this.dialogRef.close();
  }

  selectMontantLoyer(montant?: PrixParCategorieChambreDto[]): void {
    this.listMontant = Array.isArray(montant) ? montant : [];
  }

  getMontantNuite(
    nbrJour: number,
    listMontant?: PrixParCategorieChambreDto[]
  ): void {
    const pricing = Array.isArray(listMontant) ? [...listMontant] : [];

    if (!pricing.length) {
      this.laNuiteMontant = this.toNumber(this.residenceModel?.priceCategorie);
      return;
    }

    pricing.sort((left, right) =>
      this.toNumber(left.nbrDiffJour) > this.toNumber(right.nbrDiffJour) ? 1 : -1
    );

    let currentPrice = this.toNumber(pricing[pricing.length - 1]?.prix);
    for (const item of pricing) {
      if (nbrJour <= this.toNumber(item.nbrDiffJour)) {
        currentPrice = this.toNumber(item.prix);
        break;
      }
    }

    this.laNuiteMontant = currentPrice;
  }

  getDiffDays(startDate: Date, endDate: Date): void {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffInMs = Math.abs(end - start);
    this.dateDiff = Math.ceil(diffInMs / 86400000);
  }

  private buildReservationPayload(): Record<string, unknown> {
    const guest = this.selectedClient;
    const guestId = this.isCheckInMode ? this.toNumber(guest?.id) : 0;
    const username = this.resolveGuestUsername();
    const [nom, prenom] = this.resolveGuestIdentity();

    return {
      id: this.idReservation,
      idAgence: this.user?.idAgence,
      idCreateur: this.user?.id,
      idAppartementdDto: this.residenceModel?.id,
      dateDebut: this.toApiDate(this.dateDebutSejour),
      dateFin: this.toApiDate(this.dateFinSejour),
      idClient: guestId,
      idBien: this.residenceModel?.id,
      idUtilisateur: guestId,
      nom,
      prenom,
      username,
      pourcentageReduction: this.reductionPercent,
      montantReduction: this.reductionAmount,
      soldReservation: this.balanceAmountPreview,
      montantPaye: this.amountPaid,
      nmbreAdulte: this.toNumber(this.nbrAdult),
      nmbrEnfant: this.toNumber(this.nbrEnfant),
      montantDeReservation: this.totalAmountPreview,
    };
  }

  private resolveGuestUsername(): string {
    if (this.selectedClient?.username) {
      return this.selectedClient.username;
    }

    if (this.isCheckInMode && this.reservationToEdit?.username && this.hasExistingGuest()) {
      return this.reservationToEdit.username;
    }

    return '1234567890';
  }

  private resolveGuestIdentity(): [string, string] {
    if (this.selectedClient) {
      return [this.selectedClient.nom ?? '', this.selectedClient.prenom ?? ''];
    }

    if (this.isCheckInMode && this.hasExistingGuest()) {
      const guestName = this.reservationToEdit?.utilisateurOperation ?? '';
      const [nom = '', ...rest] = guestName.split(' ');
      return [nom, rest.join(' ')];
    }

    return ['XXX', 'XXXXX'];
  }

  private hydrateReservationIfNeeded(): void {
    const currentData = this.data?.idReservation;
    if (!currentData || typeof currentData !== 'object') {
      return;
    }

    this.reservationToEdit = currentData as ReservationAfficheDto;
    this.idReservation = this.toNumber(this.reservationToEdit.id);
    this.client = 2;
    this.nbrAdult = this.toNumber(this.reservationToEdit.nmbreAdulte) || 1;
    this.nbrEnfant = this.toNumber(this.reservationToEdit.nmbrEnfant);
    this.dateDebutSejour = this.toDate(this.reservationToEdit.dateDebut);
    this.dateFinSejour = this.toDate(this.reservationToEdit.dateFin);
    this.reduction = this.toNumber(this.reservationToEdit.pourcentageReduction);
    this.totalApayer = this.toNumber(this.reservationToEdit.montantReservation);
    this.resteApayer = this.toNumber(this.reservationToEdit.soldReservation);
    this.montantPayer = this.toNumber(this.reservationToEdit.montantPaye);

    if (this.dateDebutSejour && this.dateFinSejour) {
      this.getDiffDays(this.dateDebutSejour, this.dateFinSejour);
    }
  }

  private bindAppartements(): void {
    this.appartementSubscription?.unsubscribe();
    this.appartementSubscription = this.store
      .pipe(map((state) => state.appartementState))
      .subscribe((state: AppartementState) => {
        if (
          state.dataState !== AppartementStateEnum.LOADED ||
          !this.reservationToEdit?.idAppartementdDto ||
          this.residenceModel
        ) {
          return;
        }

        const match = state.appartements.find(
          (appartement) => appartement.id === this.reservationToEdit?.idAppartementdDto
        );

        if (match) {
          this.onRoomSelection(match);
        }
      });
  }

  private bindClients(): void {
    this.clientSubscription?.unsubscribe();
    this.clientSubscription = this.store
      .pipe(map((state) => state.gerantState))
      .subscribe((state: GerantState) => {
        if (
          state.dataState !== GerantStateEnum.LOADED ||
          !this.reservationToEdit?.username ||
          this.selectedClient
        ) {
          return;
        }

        const match = state.clienthotel.find(
          (client) =>
            client.username === this.reservationToEdit?.username ||
            client.email === this.reservationToEdit?.email
        );

        if (match) {
          this.selectedClient = match;
        }
      });
  }

  private resetFormState(): void {
    this.client = 1;
    this.idReservation = 0;
    this.totalApayer = 0;
    this.resteApayer = 0;
    this.reduction = 0;
    this.montantPayer = 0;
    this.nbrAdult = 1;
    this.nbrEnfant = 0;
    this.dateDebutSejour = null;
    this.dateFinSejour = null;
    this.dateDiff = 0;
    this.laNuiteMontant = 0;
    this.listMontant = [];
    this.residenceModel = null;
    this.selectedClient = null;
    this.reservationToEdit = null;
    this.prestations = [];
    this.filteredPrestations = [];
    this.prestationSearch = '';
    this.prestationsLoading = false;
    this.prestationsError = '';
    this.selectedPrestationIds.clear();
  }

  private toApiDate(value: Date | null): string {
    return value ? formatDate(new Date(value), 'yyyy-MM-dd', 'en-US') : '';
  }

  private toDate(value?: string | null): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private hasExistingGuest(): boolean {
    const guestName = (this.reservationToEdit?.utilisateurOperation ?? '').trim().toUpperCase();
    return !!guestName && guestName !== 'XXX XXXXX';
  }

  private toNumber(value: unknown): number {
    return Number(value ?? 0);
  }

  onPrestationSearch(value: string): void {
    this.prestationSearch = value ?? '';
    this.applyPrestationSearch();
  }

  isPrestationSelected(prestation: PrestationSaveOrUpdateDto): boolean {
    const id = this.toNumber(prestation?.id);
    return id > 0 && this.selectedPrestationIds.has(id);
  }

  togglePrestation(prestation: PrestationSaveOrUpdateDto, checked: boolean): void {
    const id = this.toNumber(prestation?.id);
    if (!id) {
      return;
    }

    if (checked) {
      this.selectedPrestationIds.add(id);
      return;
    }

    this.selectedPrestationIds.delete(id);
  }

  trackByPrestation(index: number, prestation: PrestationSaveOrUpdateDto): number {
    return this.toNumber(prestation?.id) || index;
  }

  private loadPrestationsCatalogue(): void {
    this.prestationsSubscription?.unsubscribe();

    this.prestationsLoading = true;
    this.prestationsError = '';

    this.prestationsSubscription = this.apiService
      .findAllServiceAdditionnelPrestation()
      .pipe(finalize(() => (this.prestationsLoading = false)))
      .subscribe({
        next: (data) => {
          const idAgence = this.user?.idAgence;
          const list = Array.isArray(data) ? data : [];
          this.prestations = [...list]
            .filter((p) => !idAgence || !p.idAgence || p.idAgence === idAgence)
            .sort((left, right) =>
              (left?.name ?? '').localeCompare(right?.name ?? '', 'fr', { sensitivity: 'base' })
            );
          this.applyPrestationSearch();
        },
        error: () => {
          this.prestationsError = 'Impossible de charger le catalogue des prestations.';
        },
      });
  }

  private loadPrestationsLinks(): void {
    this.prestationsLinkSubscription?.unsubscribe();

    if (!this.idReservation) {
      return;
    }

    this.prestationsLinkSubscription = this.apiService
      .findAllServiceAdditionnelPrestationAdditionnel()
      .subscribe({
        next: (data: PrestationAdditionnelReservationSaveOrrUpdate[]) => {
          const list = Array.isArray(data) ? data : [];
          const linked = list.filter((link) => this.toNumber(link.idReservation) === this.idReservation);
          for (const link of linked) {
            const serviceId = this.toNumber(link.idServiceAdditionnelle);
            if (serviceId) {
              this.selectedPrestationIds.add(serviceId);
            }
          }
        },
      });
  }

  private applyPrestationSearch(): void {
    const term = this.prestationSearch.trim().toLowerCase();
    if (!term) {
      this.filteredPrestations = [...this.prestations];
      return;
    }

    this.filteredPrestations = this.prestations.filter((prestation) => {
      const haystack = `${prestation.name ?? ''} ${prestation.amount ?? ''}`.toLowerCase();
      return haystack.includes(term);
    });
  }
}
