import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  AppartementDto,
  FneFactureCertificationDto,
  ReservationAfficheDto,
  ReservationRequestDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';

type ProcessingStep = '' | 'client' | 'saving' | 'certifying';

const ROLE_CLIENT_HOTEL = 'CLIENT HOTEL';

/** Une entrée sélectionnable : soit une pré-réservation à finaliser, soit une chambre libre à attribuer directement. */
type PendingEntry =
  | { kind: 'reservation'; id: number; reservation: ReservationAfficheDto }
  | { kind: 'room'; id: number; room: AppartementDto };

@Component({
  standalone: false,
  selector: 'app-page-reservation-fne',
  templateUrl: './page-reservation-fne.component.html',
  styleUrls: ['./page-reservation-fne.component.css'],
})
export class PageReservationFneComponent implements OnInit, OnDestroy {
  public user?: UtilisateurRequestDto;
  public loading = false;
  public errorMessage = '';
  public searchTerm = '';

  public pendingEntries: PendingEntry[] = [];
  public selected: PendingEntry | null = null;

  // Informations du client
  public nomClient = '';
  public telephoneClient = '';
  public emailClient = '';

  // Séjour (article unique de la facture)
  public readonly minDate = new Date();
  public readonly sejourRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  public dateDebut = '';
  public dateFin = '';
  public nombreNuitees = 1;
  public prixUnitaireHT = 0;
  public remisePercent = 0;
  public vatType = 'TVAD';

  public paymentMode = 'cash';

  public processing = false;
  public processingStep: ProcessingStep = '';

  public lastResult: {
    success: boolean;
    message: string;
    certification?: FneFactureCertificationDto;
  } | null = null;

  public readonly paymentModes: Array<{ value: string; label: string }> = [
    { value: 'cash', label: 'Espèces' },
    { value: 'card', label: 'Carte bancaire' },
    { value: 'check', label: 'Chèque' },
    { value: 'mobile-money', label: 'Mobile Money' },
    { value: 'transfer', label: 'Virement' },
    { value: 'deferred', label: 'À terme' },
  ];

  public readonly vatTypes: Array<{ value: string; label: string }> = [
    { value: 'TVA', label: 'TVA — TVA normal de 18%' },
    { value: 'TVAB', label: 'TVAB — TVA réduit de 9%' },
    { value: 'TVAC', label: 'TVAC — TVA exec conv de 0%' },
    { value: 'TVAD', label: 'TVAD — TVA exec leg de 0%' },
  ];

  private rangeSubscription?: Subscription;

  constructor(
    private readonly apiService: ApiService,
    private readonly printService: PrintServiceService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.loadEntries();

    this.rangeSubscription = this.sejourRange.valueChanges.subscribe(({ start, end }) => {
      if (!start || !end) {
        return;
      }
      this.dateDebut = formatDate(start, 'yyyy-MM-dd', 'en-US');
      this.dateFin = formatDate(end, 'yyyy-MM-dd', 'en-US');
      const nights = this.diffDays(this.dateDebut, this.dateFin);
      this.nombreNuitees = nights > 0 ? nights : 1;
    });
  }

  ngOnDestroy(): void {
    this.rangeSubscription?.unsubscribe();
  }

  get filteredEntries(): PendingEntry[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.pendingEntries;
    }

    return this.pendingEntries.filter((entry) =>
      [this.entryRoomName(entry), this.entryMeta(entry)].join(' ').toLowerCase().includes(term)
    );
  }

  /** Total HT avant remise (PU HT x nombre de nuitées) */
  get totalHT(): number {
    return Math.max(this.prixUnitaireHT, 0) * Math.max(this.nombreNuitees, 0);
  }

  /** Montant de la remise, en FCFA */
  get montantRemise(): number {
    return (this.totalHT * Math.max(this.remisePercent, 0)) / 100;
  }

  /** Total HT après remise = montant qui sera facturé (net à payer) */
  get totalApresRemise(): number {
    return Math.max(this.totalHT - this.montantRemise, 0);
  }

  get canValidate(): boolean {
    return (
      !!this.selected &&
      !!this.nomClient.trim() &&
      (!this.emailClient.trim() || this.isEmailValid(this.emailClient.trim())) &&
      !!this.dateDebut &&
      !!this.dateFin &&
      this.dateFin > this.dateDebut &&
      this.nombreNuitees > 0 &&
      this.prixUnitaireHT > 0 &&
      !!this.paymentMode &&
      !this.processing
    );
  }

  public isEmailValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  public entryRoomName(entry: PendingEntry): string {
    if (entry.kind === 'reservation') {
      return entry.reservation.bienImmobilierOperation || entry.reservation.designationBail || '—';
    }
    return (
      entry.room.nomCompletBienImmobilier ||
      entry.room.nomBaptiserBienImmobilier ||
      entry.room.codeAbrvBienImmobilier ||
      '—'
    );
  }

  public entryMeta(entry: PendingEntry): string {
    if (entry.kind === 'reservation') {
      const r = entry.reservation;
      return `${r.dateDebut ?? ''} ${r.dateFin ?? ''}`;
    }
    return entry.room.nameCategorie ?? '';
  }

  public formatCurrency(value?: number): string {
    return `${Number(value ?? 0).toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  }

  public trackByEntry(_: number, entry: PendingEntry): string {
    return `${entry.kind}-${entry.id}`;
  }

  public loadEntries(): void {
    if (!this.user?.idAgence) {
      return;
    }

    const idAgence = this.user.idAgence;
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      reservations: this.apiService.allreservationparagence(idAgence),
      rooms: this.apiService.findAllAppartementLibre(idAgence),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ reservations, rooms }) => {
          const reservationEntries: PendingEntry[] = (reservations ?? [])
            .filter((r) => this.needsCheckIn(r))
            .sort((a, b) => (a.dateDebut ?? '').localeCompare(b.dateDebut ?? ''))
            .map((reservation) => ({ kind: 'reservation', id: Number(reservation.id), reservation }));

          const roomEntries: PendingEntry[] = (rooms ?? [])
            .filter((room) => !room.occupied)
            .sort((a, b) => this.entryRoomNameOf(a).localeCompare(this.entryRoomNameOf(b)))
            .map((room) => ({ kind: 'room', id: Number(room.id), room }));

          this.pendingEntries = [...reservationEntries, ...roomEntries];

          if (this.selected && !this.pendingEntries.some((e) => e.kind === this.selected?.kind && e.id === this.selected?.id)) {
            this.resetSelection();
          }
        },
        error: () => {
          this.errorMessage = 'Impossible de charger les réservations et chambres disponibles.';
        },
      });
  }

  private entryRoomNameOf(room: AppartementDto): string {
    return room.nomCompletBienImmobilier || room.nomBaptiserBienImmobilier || room.codeAbrvBienImmobilier || '';
  }

  private needsCheckIn(r: ReservationAfficheDto): boolean {
    const guest = (r.utilisateurOperation || '').trim().toUpperCase();
    return !guest || guest === 'XXX XXXXX';
  }

  public selectEntry(entry: PendingEntry): void {
    this.selected = entry;
    this.nomClient = '';
    this.telephoneClient = '';
    this.emailClient = '';

    if (entry.kind === 'reservation') {
      const r = entry.reservation;
      const nights = this.reservationNights(r) || 1;
      this.dateDebut = r.dateDebut || this.today();
      this.dateFin = r.dateFin || this.addDays(this.dateDebut, nights);
      this.nombreNuitees = nights;
      this.prixUnitaireHT = Number(r.montantReservation ?? 0) / nights || 0;
      this.remisePercent = Number(r.pourcentageReduction ?? 0);
      this.vatType = r.vatType || r.taxes || 'TVAD';
      this.paymentMode = r.paymentMode || 'cash';
    } else {
      this.dateDebut = this.today();
      this.nombreNuitees = 1;
      this.dateFin = this.addDays(this.dateDebut, 1);
      this.prixUnitaireHT = Number(entry.room.priceCategorie ?? 0);
      this.remisePercent = 0;
      this.vatType = 'TVAD';
      this.paymentMode = 'cash';
    }

    this.syncSejourRange();
    this.lastResult = null;
  }

  /** Le nombre de nuitées a été saisi manuellement : on recalcule la date de départ et on met à jour le calendrier. */
  public onNombreNuiteesChange(): void {
    if (this.nombreNuitees < 1) {
      this.nombreNuitees = 1;
    }
    this.dateFin = this.addDays(this.dateDebut, this.nombreNuitees);
    this.syncSejourRange();
  }

  /** Reflète dateDebut/dateFin dans le champ calendrier, sans redéclencher la synchronisation inverse. */
  private syncSejourRange(): void {
    this.sejourRange.setValue(
      {
        start: this.dateDebut ? new Date(this.dateDebut) : null,
        end: this.dateFin ? new Date(this.dateFin) : null,
      },
      { emitEvent: false }
    );
  }

  private reservationNights(r: ReservationAfficheDto): number {
    if (!r.dateDebut || !r.dateFin) {
      return 0;
    }
    const diff = Math.ceil(
      (new Date(r.dateFin).getTime() - new Date(r.dateDebut).getTime()) / 86400000
    );
    return Math.max(diff, 1);
  }

  private diffDays(startStr: string, endStr: string): number {
    if (!startStr || !endStr) {
      return 0;
    }
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 0;
    }
    return Math.round((end.getTime() - start.getTime()) / 86400000);
  }

  private today(): string {
    return formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  }

  private resetSelection(): void {
    this.selected = null;
    this.nomClient = '';
    this.telephoneClient = '';
    this.emailClient = '';
    this.dateDebut = '';
    this.dateFin = '';
    this.nombreNuitees = 1;
    this.prixUnitaireHT = 0;
    this.remisePercent = 0;
    this.vatType = 'TVAD';
    this.paymentMode = 'cash';
    this.lastResult = null;
    this.sejourRange.setValue({ start: null, end: null }, { emitEvent: false });
  }

  public validerEtCertifier(): void {
    if (!this.canValidate || !this.selected || !this.user) {
      return;
    }

    const entry = this.selected;

    this.processing = true;
    this.processingStep = 'client';
    this.lastResult = null;

    this.apiService.saveUtilisateur(this.buildClientRequest()).subscribe({
      next: (client) => {
        if (!client?.id) {
          this.fail("Le client n'a pas pu être créé.");
          return;
        }
        this.enregistrerEntreeEnChambre(entry, client.id, client.email ?? '');
      },
      error: () => this.fail("Le client n'a pas pu être créé."),
    });
  }

  private enregistrerEntreeEnChambre(entry: PendingEntry, idClient: number, clientEmail: string): void {
    this.processingStep = 'saving';
    const request = this.buildReservationRequest(entry, idClient, clientEmail);

    this.apiService.saveorupdatereservation(request).subscribe({
      next: (saved) => {
        const id = Number(saved?.id);
        if (!id) {
          this.fail("L'entrée en chambre n'a pas pu être enregistrée.");
          return;
        }
        this.certifierApresEntree(id);
      },
      error: () => this.fail("L'entrée en chambre n'a pas pu être enregistrée."),
    });
  }

  private certifierApresEntree(idReservation: number): void {
    this.processingStep = 'certifying';

    this.printService
      .factureReservation(idReservation)
      .pipe(finalize(() => (this.processing = false)))
      .subscribe({
        next: () => this.verifierCertification(idReservation),
        error: () => {
          this.processingStep = '';
          this.lastResult = {
            success: false,
            message: "L'entrée en chambre a été enregistrée, mais la certification FNE a échoué.",
          };
          this.notificationService.notify(NotificationType.ERROR, this.lastResult.message);
          this.loadEntries();
        },
      });
  }

  private verifierCertification(idReservation: number): void {
    if (!this.user?.idAgence) {
      this.processingStep = '';
      return;
    }

    this.apiService.listeFacturesCertifieesFne(this.user.idAgence).subscribe({
      next: (factures) => {
        this.processingStep = '';
        const derniere = (factures ?? [])
          .filter((f) => f.idReservation === idReservation)
          .pop();

        if (derniere?.certifiee) {
          this.lastResult = {
            success: true,
            message: `Entrée en chambre validée et facture ${derniere.factureNumero ?? ''} certifiée avec succès auprès de la FNE.`,
            certification: derniere,
          };
          this.notificationService.notify(NotificationType.SUCCESS, this.lastResult.message);
          if (derniere.fneVerificationUrl) {
            window.open(derniere.fneVerificationUrl, '_blank');
          }
        } else {
          this.lastResult = {
            success: false,
            message: `Entrée en chambre enregistrée, mais la certification FNE a échoué${
              derniere?.messageErreur ? ' : ' + derniere.messageErreur : '.'
            }`,
            certification: derniere,
          };
          this.notificationService.notify(NotificationType.ERROR, this.lastResult.message);
        }

        this.loadEntries();
      },
      error: () => {
        this.processingStep = '';
        this.lastResult = {
          success: false,
          message: 'Entrée en chambre enregistrée, mais impossible de vérifier le statut de certification FNE.',
        };
        this.notificationService.notify(NotificationType.WARNING, this.lastResult.message);
        this.loadEntries();
      },
    });
  }

  private fail(message: string): void {
    this.processing = false;
    this.processingStep = '';
    this.lastResult = { success: false, message };
    this.notificationService.notify(NotificationType.ERROR, message);
  }

  private buildClientRequest(): UtilisateurRequestDto {
    const phone = this.telephoneClient.trim();
    const email = this.emailClient.trim();
    // Le backend exige un "mobile" non vide et unique (contrainte d'unicité en base) :
    // s'il n'est pas saisi, on génère un identifiant unique pour ne pas bloquer la création du client.
    const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const mobile = phone || `SANS-TEL-${uniqueSuffix}`;
    const localPart = (phone || mobile).replace(/[^0-9a-zA-Z+]/g, '') || `client${uniqueSuffix}`;

    return {
      idAgence: this.user?.idAgence,
      userCreate: this.user?.id,
      nom: this.nomClient.trim(),
      mobile,
      email: email || `${localPart}@client.local`,
      password: Math.random().toString(36).slice(-10),
      roleUsed: ROLE_CLIENT_HOTEL,
      active: true,
      activated: true,
      nonLocked: true,
    };
  }

  private buildReservationRequest(
    entry: PendingEntry,
    idClient: number,
    clientEmail: string
  ): ReservationRequestDto {
    const nom = this.nomClient.trim();
    const montantTotal = this.totalApresRemise;
    const email = this.emailClient.trim() || clientEmail;

    const base =
      entry.kind === 'reservation'
        ? this.baseFromReservation(entry.reservation)
        : this.baseFromRoom(entry.room);

    const montantPaye = base.montantPaye;
    const soldReservation = Math.max(montantTotal - montantPaye, 0);

    return {
      id: base.id,
      idAgence: this.user?.idAgence,
      idCreateur: this.user?.id,
      idAppartementdDto: base.idAppartementdDto,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      idClient,
      idBien: base.idAppartementdDto,
      idUtilisateur: idClient,
      nom,
      prenom: '',
      username: clientEmail,
      clientReservation: nom,
      email,
      paymentMode: this.paymentMode,
      pourcentageReduction: this.remisePercent,
      montantReduction: this.montantRemise,
      soldReservation,
      montantPaye,
      montantDeReservation: montantTotal,
      nmbreAdulte: base.nmbreAdulte,
      nmbrEnfant: base.nmbrEnfant,
      vatType: this.vatType,
      taxes: this.vatType,
      typeSejour: base.typeSejour,
    };
  }

  private baseFromReservation(r: ReservationAfficheDto) {
    return {
      id: r.id,
      idAppartementdDto: r.idAppartementdDto,
      montantPaye: Number(r.montantPaye ?? 0),
      nmbreAdulte: r.nmbreAdulte || 1,
      nmbrEnfant: r.nmbrEnfant,
      typeSejour: r.typeSejour || 'SEJOUR',
    };
  }

  private baseFromRoom(room: AppartementDto) {
    return {
      id: undefined as number | undefined,
      idAppartementdDto: room.id,
      montantPaye: 0,
      nmbreAdulte: 1,
      nmbrEnfant: 0,
      typeSejour: 'SEJOUR',
    };
  }

  private addDays(dateStr: string | null | undefined, days: number): string {
    if (!dateStr) {
      return '';
    }
    const base = new Date(dateStr);
    if (Number.isNaN(base.getTime())) {
      return '';
    }
    base.setDate(base.getDate() + Math.max(days, 1));
    return formatDate(base, 'yyyy-MM-dd', 'en-US');
  }
}
