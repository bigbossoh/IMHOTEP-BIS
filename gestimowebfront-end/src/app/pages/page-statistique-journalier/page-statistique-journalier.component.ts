import { Store } from '@ngrx/store';
import { formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { PeriodeDto } from 'src/gs-api/src/models/periode-dto';
import { StatistiquePeriodeDto } from 'src/gs-api/src/models/statistique-periode-dto';
import { GetAllAnneeActions } from './../../ngrx/annee/annee.actions';
import { AnneeState, AnneeStateEnum } from './../../ngrx/annee/annee.reducer';
import {
  GetImayerLoyerParAnneeActions,
  GetImpayerLoyerParPeriodeActions,
  GetPayerLoyerParAnneeActions,
  GetPayerLoyerParPeriodeActions,
  GetStatLoyerParAnneeActions,
  GetStatLoyerParPeriodeActions,
} from './../../ngrx/appelloyer/appelloyer.actions';
import {
  AppelLoyerState,
  AppelLoyerStateEnum,
} from './../../ngrx/appelloyer/appelloyer.reducer';
import { GetAllPeriodeActions } from './../../ngrx/appelloyer/peiodeappel/periodeappel.actions';
import {
  PeriodeState,
  PeriodeStateEnum,
} from './../../ngrx/appelloyer/peiodeappel/periodeappel.reducer';
import { TotalEncaissementParJourActions } from './../../ngrx/reglement/reglement.actions';
import {
  EncaissementState,
  EncaissementStateEnum,
} from './../../ngrx/reglement/reglement.reducer';
import { UserService } from 'src/app/services/user/user.service';

interface FinanceSummary {
  label: string;
  paid: number;
  unpaid: number;
  total: number;
  recoveryRate: number;
  hasData: boolean;
}

interface BreakdownItem {
  id: string;
  label: string;
  helper: string;
  value: number;
  share: number;
  tone: 'success' | 'danger';
}

interface StatTile {
  id: string;
  title: string;
  caption: string;
  icon: string;
  type: 'currency' | 'percent';
  tone: 'primary' | 'success' | 'warning' | 'danger';
  value: number;
}

const initialAnneeState: AnneeState = {
  annees: [],
  errorMessage: '',
  dataState: AnneeStateEnum.INITIAL,
};

const initialPeriodeState: PeriodeState = {
  periodes: [],
  errorMessage: '',
  dataState: PeriodeStateEnum.INITIAL,
};

const initialAppelLoyerState: AppelLoyerState = {
  smss: null,
  statPeriode: null,
  statAnnee: null,
  appelloyers: [],
  anneesAppel: [],
  periodes: [],
  impayerAnnee: 0,
  payerAnnee: 0,
  impayerPeriode: 0,
  payerPeriode: 0,
  errorMessage: '',
  dataState: AppelLoyerStateEnum.INITIAL,
};

const initialEncaissementState: EncaissementState = {
  encaissements: [],
  encaissementsLoyer: null,
  encaissementsCloture: null,
  appelloyers: null,
  errorMessage: '',
  montantEncaisse: 0,
  montantDue: 0,
  dataState: EncaissementStateEnum.INITIAL,
  locatairesImpayer: [],
  leLocataire: null,
};

@Component({
  standalone: false,
  selector: 'app-page-statistique-journalier',
  templateUrl: './page-statistique-journalier.component.html',
  styleUrls: ['./page-statistique-journalier.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageStatistiqueJournalierComponent {
  private readonly store: Store<any> = inject(Store);
  private readonly userService = inject(UserService);
  private readonly agenceScope = 0;

  readonly AnneeStateEnum = AnneeStateEnum;
  readonly PeriodeStateEnum = PeriodeStateEnum;

  private readonly today = new Date();

  readonly selectedDate = signal<Date>(this.today);
  readonly selectedYear = signal<number>(this.today.getFullYear());
  readonly selectedPeriod = signal<string>(this.formatPeriod(this.today));
  readonly user = signal<UtilisateurRequestDto | null>(this.getUserSafely());

  readonly anneeState = toSignal(
    this.store.pipe(map((state) => state.anneeState as AnneeState)),
    { initialValue: initialAnneeState }
  );
  readonly periodeState = toSignal(
    this.store.pipe(map((state) => state.periodeState as PeriodeState)),
    { initialValue: initialPeriodeState }
  );
  readonly appelLoyerState = toSignal(
    this.store.pipe(map((state) => state.appelLoyerState as AppelLoyerState)),
    { initialValue: initialAppelLoyerState }
  );
  readonly encaissementState = toSignal(
    this.store.pipe(map((state) => state.encaissementState as EncaissementState)),
    { initialValue: initialEncaissementState }
  );

  readonly scopeLabel = computed(() => 'Vue agence');

  readonly selectedDateLabel = computed(() =>
    formatDate(this.selectedDate(), 'EEEE d MMMM y', 'fr-FR')
  );

  readonly selectedDateInputValue = computed(() =>
    formatDate(this.selectedDate(), 'yyyy-MM-dd', 'en')
  );

  readonly periodOptions = computed(() => this.periodeState().periodes ?? []);
  readonly yearOptions = computed(() => this.anneeState().annees ?? []);

  readonly selectedPeriodLabel = computed(() => {
    const selected = this.periodOptions().find(
      (periode) => periode.periodeAppelLoyer === this.selectedPeriod()
    );
    return selected?.periodeLettre ?? this.selectedPeriod();
  });

  readonly isReferenceLoading = computed(
    () =>
      this.anneeState().dataState === AnneeStateEnum.LOADING ||
      this.periodeState().dataState === PeriodeStateEnum.LOADING
  );

  readonly hasReferenceError = computed(
    () =>
      this.anneeState().dataState === AnneeStateEnum.ERROR ||
      this.periodeState().dataState === PeriodeStateEnum.ERROR
  );

  readonly monthSummary = computed(() =>
    this.buildFinanceSummary(
      this.appelLoyerState().statPeriode,
      this.appelLoyerState().payerPeriode,
      this.appelLoyerState().impayerPeriode,
      this.selectedPeriodLabel()
    )
  );

  readonly yearSummary = computed(() =>
    this.buildFinanceSummary(
      this.appelLoyerState().statAnnee,
      this.appelLoyerState().payerAnnee,
      this.appelLoyerState().impayerAnnee,
      `Annee ${this.selectedYear()}`
    )
  );

  readonly dailySummary = computed(() => {
    const collected = Number(this.encaissementState().montantEncaisse ?? 0);
    return {
      collected,
      outflow: 0,
      balance: collected,
    };
  });

  readonly summaryTiles = computed<StatTile[]>(() => [
    {
      id: 'period-recovery',
      title: 'Recouvrement periode',
      caption: this.selectedPeriodLabel(),
      icon: 'fas fa-chart-pie',
      type: 'percent',
      tone: 'primary',
      value: this.monthSummary().recoveryRate,
    },
    {
      id: 'period-paid',
      title: 'Loyers encaisses',
      caption: this.selectedPeriodLabel(),
      icon: 'fas fa-money-bill-wave',
      type: 'currency',
      tone: 'success',
      value: this.monthSummary().paid,
    },
    {
      id: 'year-recovery',
      title: 'Recouvrement annuel',
      caption: `${this.selectedYear()}`,
      icon: 'fas fa-chart-line',
      type: 'percent',
      tone: 'warning',
      value: this.yearSummary().recoveryRate,
    },
    {
      id: 'daily-cash',
      title: 'Encaissement du jour',
      caption: this.selectedDateLabel(),
      icon: 'fas fa-calendar-alt',
      type: 'currency',
      tone: 'danger',
      value: this.dailySummary().collected,
    },
  ]);

  readonly monthBreakdown = computed(() =>
    this.buildBreakdownItems(this.monthSummary())
  );
  readonly yearBreakdown = computed(() =>
    this.buildBreakdownItems(this.yearSummary())
  );

  readonly monthDonutBackground = computed(() =>
    this.buildDonutBackground(this.monthSummary())
  );
  readonly yearDonutBackground = computed(() =>
    this.buildDonutBackground(this.yearSummary())
  );

  constructor() {
    effect(() => {
      const currentUser = this.user();
      if (!currentUser) {
        return;
      }

      this.store.dispatch(new GetAllAnneeActions(currentUser.idAgence));
      this.store.dispatch(new GetAllPeriodeActions(currentUser.idAgence));
    });

    effect(() => {
      const currentUser = this.user();
      if (!currentUser) {
        return;
      }

      const annee = this.selectedYear();
      const chapitre = this.agenceScope;

      this.store.dispatch(
        new GetImayerLoyerParAnneeActions({
          idAgence: currentUser.idAgence,
          annee,
          chapitre,
        })
      );
      this.store.dispatch(
        new GetPayerLoyerParAnneeActions({
          idAgence: currentUser.idAgence,
          annee,
          chapitre,
        })
      );
      this.store.dispatch(
        new GetStatLoyerParAnneeActions({
          idAgence: currentUser.idAgence,
          annee,
          chapitre,
        })
      );
    });

    effect(() => {
      const currentUser = this.user();
      if (!currentUser) {
        return;
      }

      const periode = this.selectedPeriod();
      const chapitre = this.agenceScope;

      this.store.dispatch(
        new GetImpayerLoyerParPeriodeActions({
          periode,
          idAgence: currentUser.idAgence,
          chapitre,
        })
      );
      this.store.dispatch(
        new GetPayerLoyerParPeriodeActions({
          periode,
          idAgence: currentUser.idAgence,
          chapitre,
        })
      );
      this.store.dispatch(
        new GetStatLoyerParPeriodeActions({
          periode,
          idAgence: currentUser.idAgence,
          chapitre,
        })
      );
    });

    effect(() => {
      const currentUser = this.user();
      if (!currentUser) {
        return;
      }

      this.store.dispatch(
        new TotalEncaissementParJourActions({
          jour: formatDate(this.selectedDate(), 'dd-MM-yyyy', 'en'),
          idAgence: currentUser.idAgence,
          chapitre: this.agenceScope,
        })
      );
    });
  }

  onDateChange(date: Date | null): void {
    if (date) {
      this.selectedDate.set(date);
    }
  }

  onDateInputChange(value: string): void {
    if (!value) {
      return;
    }

    const parsedDate = new Date(`${value}T00:00:00`);
    if (!Number.isNaN(parsedDate.getTime())) {
      this.selectedDate.set(parsedDate);
    }
  }

  onYearChange(annee: number): void {
    if (annee) {
      this.selectedYear.set(Number(annee));
    }
  }

  onPeriodChange(periode: string): void {
    if (periode) {
      this.selectedPeriod.set(periode);
    }
  }

  resetToCurrentPeriod(): void {
    this.selectedDate.set(this.today);
    this.selectedYear.set(this.today.getFullYear());
    this.selectedPeriod.set(this.formatPeriod(this.today));
  }

  trackPeriod(_: number, periode: PeriodeDto): string {
    return periode.periodeAppelLoyer ?? `${_}`;
  }

  private getUserSafely(): UtilisateurRequestDto | null {
    try {
      return this.userService.getUserFromLocalCache();
    } catch (error) {
      return null;
    }
  }

  private formatPeriod(date: Date): string {
    return formatDate(date, 'yyyy-MM', 'en');
  }

  private buildFinanceSummary(
    stats: StatistiquePeriodeDto | null | undefined,
    payer: number,
    impayer: number,
    label: string
  ): FinanceSummary {
    const paid = Number(stats?.payer ?? payer ?? 0);
    const unpaid = Number(stats?.impayer ?? impayer ?? 0);
    const total = Number(stats?.totalLoyer ?? paid + unpaid);
    const computedRecovery = total > 0 ? (paid / total) * 100 : 0;
    const recoveryRate = Number(stats?.recouvrement ?? computedRecovery);

    return {
      label,
      paid,
      unpaid,
      total,
      recoveryRate: this.clampPercentage(recoveryRate),
      hasData: total > 0 || paid > 0 || unpaid > 0,
    };
  }

  private buildBreakdownItems(summary: FinanceSummary): BreakdownItem[] {
    return [
      {
        id: 'paid',
        label: 'Encaisse',
        helper: 'Montant regle',
        value: summary.paid,
        share: this.calculateShare(summary.paid, summary.total),
        tone: 'success',
      },
      {
        id: 'unpaid',
        label: 'Impaye',
        helper: 'Montant a relancer',
        value: summary.unpaid,
        share: this.calculateShare(summary.unpaid, summary.total),
        tone: 'danger',
      },
    ];
  }

  private buildDonutBackground(summary: FinanceSummary): string {
    if (!summary.hasData || summary.total <= 0) {
      return 'conic-gradient(#dbe6f5 0deg, #dbe6f5 360deg)';
    }

    const paidAngle = (summary.paid / summary.total) * 360;
    return `conic-gradient(#16a34a 0deg ${paidAngle}deg, #ef4444 ${paidAngle}deg 360deg)`;
  }

  private calculateShare(value: number, total: number): number {
    if (total <= 0) {
      return 0;
    }

    return this.clampPercentage((value / total) * 100);
  }

  private clampPercentage(value: number): number {
    return Math.min(Math.max(Number(value || 0), 0), 100);
  }
}
