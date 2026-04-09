import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { GetAllAppartementMeubleParCategorieActions } from 'src/app/ngrx/appartement/appartement.actions';
import { AppartementStateEnum } from 'src/app/ngrx/appartement/appartement.reducer';
import { ListChambreCategorieActions } from 'src/app/ngrx/categoriechambre/categoriechambre.actions';
import { CategorieChambreStateEnum } from 'src/app/ngrx/categoriechambre/categoriechambre.reducer';
import { ListPrixChambreParCategorieActions } from 'src/app/ngrx/prix-par-categorie-chambre/prix-par-categorie-chambre.action';
import { PrixParCategorieChambreStateEnum } from 'src/app/ngrx/prix-par-categorie-chambre/prix-par-categorie-chambre.reducers';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { NewCategorieChambreComponent } from './new-categorie-chambre/new-categorie-chambre.component';
import { NewPrixCategorieChambreComponent } from '../bien-immobilier/new-prix-categorie-chambre/new-prix-categorie-chambre.component';
import { SaveCategorieAppartComponent } from './save-categorie-appart/save-categorie-appart.component';

export type DetailTab = 'prix' | 'appartements';

@Component({
  standalone: false,
  selector: 'app-categorie-appartement',
  templateUrl: './categorie-appartement.component.html',
  styleUrls: ['./categorie-appartement.component.css'],
})
export class CategorieAppartementComponent implements OnInit {

  public user?: UtilisateurRequestDto;

  // Catégories
  allCategories: any[] = [];
  filteredCategories: any[] = [];
  searchCategorie = '';
  isLoadingCategories = false;

  // Catégorie sélectionnée
  selectedCategorie: any = null;
  detailTab: DetailTab = 'prix';

  // Prix
  allPrix: any[] = [];
  isLoadingPrix = false;

  // Appartements
  allApparts: any[] = [];
  isLoadingApparts = false;

  readonly CategorieChambreStateEnum = CategorieChambreStateEnum;
  readonly PrixParCategorieChambreStateEnum = PrixParCategorieChambreStateEnum;
  readonly AppartementStateEnum = AppartementStateEnum;

  constructor(
    private store: Store<any>,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    this.loadCategories();
  }

  // ─── Chargement catégories ────────────────────────────────────────────────

  public loadCategories(): void {
    this.isLoadingCategories = true;
    this.store.dispatch(new ListChambreCategorieActions(this.user!.idAgence));
    this.store.pipe(map((state) => state.categorieChambreState)).subscribe((data) => {
      if (data.dataState === CategorieChambreStateEnum.LOADED) {
        this.isLoadingCategories = false;
        this.allCategories = data.listCategorieChambre ?? [];
        this.applySearchCategorie();
        if (!this.selectedCategorie && this.allCategories.length > 0) {
          this.selectCategorie(this.allCategories[0]);
        }
      }
      if (data.dataState === CategorieChambreStateEnum.ERROR) {
        this.isLoadingCategories = false;
      }
    });
  }

  // ─── Sélection / détail ───────────────────────────────────────────────────

  public selectCategorie(cat: any): void {
    this.selectedCategorie = cat;
    this.loadPrix(cat.id);
    this.loadApparts(cat.id);
  }

  public setDetailTab(tab: DetailTab): void {
    this.detailTab = tab;
  }

  // ─── Prix ─────────────────────────────────────────────────────────────────

  public loadPrix(idCat: any): void {
    this.isLoadingPrix = true;
    this.store.dispatch(new ListPrixChambreParCategorieActions(idCat));
    this.store.pipe(map((state) => state.prixParCategorieChambreState)).subscribe((data) => {
      if (data.dataState === PrixParCategorieChambreStateEnum.LOADED) {
        this.isLoadingPrix = false;
        this.allPrix = data.listPrixParCategorieChambre ?? [];
      }
      if (data.dataState === PrixParCategorieChambreStateEnum.ERROR) {
        this.isLoadingPrix = false;
      }
    });
  }

  // ─── Appartements ─────────────────────────────────────────────────────────

  public loadApparts(idCat: any): void {
    this.isLoadingApparts = true;
    this.store.dispatch(new GetAllAppartementMeubleParCategorieActions(idCat));
    this.store.pipe(map((state) => state.appartementState)).subscribe((data) => {
      if (data.dataState === AppartementStateEnum.LOADED) {
        this.isLoadingApparts = false;
        this.allApparts = data.appartementsCatego ?? [];
      }
      if (data.dataState === AppartementStateEnum.ERROR) {
        this.isLoadingApparts = false;
      }
    });
  }

  // ─── Recherche catégories ─────────────────────────────────────────────────

  public onSearchCategorie(event: Event): void {
    this.searchCategorie = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applySearchCategorie();
  }

  private applySearchCategorie(): void {
    if (!this.searchCategorie) {
      this.filteredCategories = [...this.allCategories];
      return;
    }
    this.filteredCategories = this.allCategories.filter((c) =>
      [`${c.id}`, c.name, c.description].join(' ').toLowerCase().includes(this.searchCategorie)
    );
  }

  // ─── Dialogues ────────────────────────────────────────────────────────────

  public openDialogNewCategorie(): void {
    const ref = this.dialog.open(NewCategorieChambreComponent, { data: {} });
    ref.afterClosed().subscribe(() => this.loadCategories());
  }

  public openDialogPrix(): void {
    if (!this.selectedCategorie) return;
    const ref = this.dialog.open(NewPrixCategorieChambreComponent, {
      data: { cate: this.selectedCategorie },
      width: '500px',
    });
    ref.afterClosed().subscribe(() => this.loadPrix(this.selectedCategorie.id));
  }

  public openDialogApp(bien: any): void {
    const ref = this.dialog.open(SaveCategorieAppartComponent, {
      width: '500px',
      data: { bien },
    });
    ref.afterClosed().subscribe(() => {
      if (this.selectedCategorie) this.loadApparts(this.selectedCategorie.id);
    });
  }

  // ─── Formatage ────────────────────────────────────────────────────────────

  public formatCurrency(value: number | null | undefined): string {
    const amount = Number(value ?? 0);
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} FCFA`;
  }

  public getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();
  }
}
