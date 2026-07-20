import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { PrintServiceService } from 'src/app/services/Print/print-service.service';
import { UserService } from 'src/app/services/user/user.service';
import { ApiService } from 'src/gs-api/src/services';
import { SiteResponseDto, UtilisateurRequestDto } from 'src/gs-api/src/models';

@Component({
  standalone: false,
  selector: 'app-page-registre-caisse',
  templateUrl: './page-registre-caisse.component.html',
  styleUrls: ['./page-registre-caisse.component.css'],
})
export class PageRegistreCaisseComponent implements OnInit {
  public user?: UtilisateurRequestDto;
  public sites: SiteResponseDto[] = [];
  public siteId: number | null = null;
  public dateDebut = this.toInputDate(this.firstDayOfMonth(new Date()));
  public dateFin = this.toInputDate(new Date());
  public isLoading = false;
  public errorMessage = '';

  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    private readonly printServiceService: PrintServiceService
  ) {}

  public ngOnInit(): void {
    this.user = this.getCurrentUser();
    const idAgence = this.getAgenceId();
    if (!idAgence) {
      this.errorMessage = 'Impossible de charger les sites : agence utilisateur introuvable.';
      return;
    }
    this.apiService.findAllSites(idAgence).subscribe({
      next: (sites) => (this.sites = sites ?? []),
      error: () => (this.errorMessage = 'Impossible de charger la liste des sites.'),
    });
  }

  public genererRegistre(): void {
    if (!this.siteId || !this.dateDebut || !this.dateFin) {
      this.errorMessage = 'Veuillez sélectionner un site et une période.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.printServiceService
      .registreRecettesDepenses(this.siteId, this.dateDebut, this.dateFin)
      .subscribe({
        next: (blob) => {
          this.isLoading = false;
          const nomSite = this.sites.find((site) => site.id === this.siteId)?.nomSite ?? this.siteId;
          const nomFichier = `registre-caisse-${nomSite}-${this.dateDebut}-au-${this.dateFin}.xlsm`;
          saveAs(blob, nomFichier);
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Le registre n’a pas pu être généré.';
        },
      });
  }

  private firstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private toInputDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getCurrentUser(): UtilisateurRequestDto | undefined {
    try {
      return this.userService.getUserFromLocalCache() ?? undefined;
    } catch (error) {
      return undefined;
    }
  }

  private getAgenceId(): number {
    return Number(this.user?.idAgence ?? 0);
  }
}
