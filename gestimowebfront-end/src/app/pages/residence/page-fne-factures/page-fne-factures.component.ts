import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { finalize } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import { FneFactureCertificationDto, UtilisateurRequestDto } from 'src/gs-api/src/models';
import { ApiService } from 'src/gs-api/src/services';

@Component({
  standalone: false,
  selector: 'app-page-fne-factures',
  templateUrl: './page-fne-factures.component.html',
  styleUrls: ['./page-fne-factures.component.css'],
})
export class PageFneFacturesComponent implements OnInit {
  public user?: UtilisateurRequestDto;
  public factures: FneFactureCertificationDto[] = [];
  public isLoading = false;
  public errorMessage = '';
  public searchTerm = '';
  public statutFiltre: 'TOUS' | 'CERTIFIEE' | 'ECHEC' = 'TOUS';
  public downloadingId: number | null = null;

  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    private readonly printService: PrintServiceService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.load();
  }

  public load(): void {
    if (!this.user?.idAgence) {
      this.errorMessage = "Impossible de charger les certifications : agence introuvable.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.listeFacturesCertifieesFne(this.user.idAgence).subscribe({
      next: (factures) => {
        this.factures = [...(factures ?? [])].sort((a, b) =>
          this.timestamp(b.dateCertification) - this.timestamp(a.dateCertification)
        );
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger la liste des factures certifiées FNE.';
        this.isLoading = false;
      },
    });
  }

  public get filteredFactures(): FneFactureCertificationDto[] {
    let rows = this.factures;

    if (this.statutFiltre === 'CERTIFIEE') {
      rows = rows.filter((f) => f.certifiee);
    } else if (this.statutFiltre === 'ECHEC') {
      rows = rows.filter((f) => !f.certifiee);
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return rows;
    }

    return rows.filter((f) =>
      [
        f.factureNumero,
        f.fneReference,
        f.fneNcc,
        f.clientNom,
        f.etablissement,
        f.modePaiement,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }

  public get totalCertifiees(): number {
    return this.factures.filter((f) => f.certifiee).length;
  }

  public get totalEchecs(): number {
    return this.factures.filter((f) => !f.certifiee).length;
  }

  public get montantTotalCertifie(): number {
    return this.factures
      .filter((f) => f.certifiee)
      .reduce((total, f) => total + Number(f.montant ?? 0), 0);
  }

  public get totalAvecAlerte(): number {
    return this.factures.filter((f) => f.certifiee && f.fneWarning).length;
  }

  public onStatutFiltreChange(event: Event): void {
    this.statutFiltre = (event.target as HTMLSelectElement).value as
      | 'TOUS'
      | 'CERTIFIEE'
      | 'ECHEC';
  }

  public formatCurrency(value: number | null | undefined): string {
    const amount = Number(value ?? 0);
    return `${amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  }

  public statusLabel(f: FneFactureCertificationDto): string {
    return f.certifiee ? 'Certifiée FNE' : 'Non certifiée';
  }

  public statusClass(f: FneFactureCertificationDto): string {
    return f.certifiee ? 'badge badge--success' : 'badge badge--danger';
  }

  public isDownloading(f: FneFactureCertificationDto): boolean {
    return this.downloadingId === f.idReservation;
  }

  public canDownload(f: FneFactureCertificationDto): boolean {
    return !!f.idReservation;
  }

  public telechargerFacture(f: FneFactureCertificationDto): void {
    const id = Number(f?.idReservation);
    if (!Number.isFinite(id) || id <= 0 || this.downloadingId !== null) {
      return;
    }

    this.downloadingId = id;
    this.printService
      .factureReservation(id)
      .pipe(finalize(() => (this.downloadingId = null)))
      .subscribe({
        next: (blob) => {
          saveAs(blob, `${f.factureNumero || 'facture'}.pdf`);
        },
        error: () => {
          this.notificationService.notify(
            NotificationType.ERROR,
            'Impossible de télécharger la facture.'
          );
        },
      });
  }

  public trackByRow(_: number, f: FneFactureCertificationDto): number {
    return f.id ?? _;
  }

  private timestamp(value: string | null | undefined): number {
    if (!value) {
      return 0;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  }
}
