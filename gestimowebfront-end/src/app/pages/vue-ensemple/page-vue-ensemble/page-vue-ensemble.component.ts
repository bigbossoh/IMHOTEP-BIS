import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  BienImmobilierAffiheDto,
  LocataireEncaisDTO,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { StatistiqueService } from '../../../services/statistique_dashboard/statistique.service';
import { UserService } from '../../../services/user/user.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StatistiqueChartState } from 'src/app/ngrx/statistique-chart/statistiquechart.reducer';
import { GetAllStatistiquePeriodeAction } from 'src/app/ngrx/statistique-chart/statistiquechart.action';
import { map } from 'rxjs/operators';

export interface data {
  [key: string]: any;
}

@Component({
  standalone: false,
  selector: 'app-page-vue-ensemble',
  templateUrl: './page-vue-ensemble.component.html',
  styleUrls: ['./page-vue-ensemble.component.css'],
})
export class PageVueEnsembleComponent implements OnInit, data {
  listeTOUTUser: number = 0;
  totalUtilisateur = 0;
  totalLocatireActifParAgence = 0;
  totalLocataireParAgence = 0;
  totalBailActif: number = 0;
  totalBauxNonActif: number = 0;
  totalPieces: number = 70;
  totalBiens: number = 0;
  totalBiensOQp: number = 0;
  PrcentagePiece: number = 0;
  idAgence: any = 0;
  totalequipement: number = 250;
  totquipement: number = 0;
  prcentagetotquipement: number = 0;
  totsignal: number = 0;
  PrcentageBiens: number = 0;
  public user?: UtilisateurRequestDto;
  chartType = 'line';
  dataset: any[] = [];
  labels: string[] = [];
  chartOptions: any = {
    legend: {
      position: 'bottom',
      labels: {
        fontSize: 16,
        usePointStyle: true,
      },
    },
  };

  public lineChartData: any[] = [];
  public lineChartLabels: string[] = [];
  public lineChartOptions: any = {
    responsive: true,
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'month',
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  public lineChartType = 'line';
  public lineChartLegend = true;
  public lineChartPlugins = [];
  chartState$: Observable<StatistiqueChartState> | null = null;
  private biensFiltres: BienImmobilierAffiheDto[] = [];
  private locatairesAvecBauxActifs: LocataireEncaisDTO[] = [];

  constructor(
    private statistique: StatistiqueService,
    private userService: UserService,
    private store: Store<any>
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    if (!this.user?.id) {
      return;
    }
    this.idAgence = this.user?.idAgence;
    this.refreshDashboardKpis();

    this.store.dispatch(
      new GetAllStatistiquePeriodeAction({
        idAgence: this.user.idAgence,
        datedebut: '01-01-2023',
        datefin: '01-12-2023',
      })
    );
    this.chartState$ = this.store.pipe(
      map((state) => state.statistiqueChartState)
    );
    this.store
      .pipe(map((state) => state.statistiqueChartState))
      .subscribe((data) => {});
  }

  public getNombreBienImmobiliers(chapitre: any, agence: any) {
    this.statistique.getAllBienImmobilier(chapitre, agence).subscribe(
      (response: BienImmobilierAffiheDto[]) => {
        this.biensFiltres = response ?? [];
        this.totalBiens = this.biensFiltres.length;
        this.refreshFilteredLeaseKpis();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getNombreBienImmobiliersOqp(chapitre: any, agence: any) {
    this.statistique.getAllBienImmobilierOccuper(chapitre, agence).subscribe(
      (response: BienImmobilierAffiheDto[]) => {
        this.totalBiensOQp = (response ?? []).length;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  private getNbreLocataire(agence: any) {
    this.statistique.getAllLocatire(agence).subscribe(
      (response) => {
        this.totalLocataireParAgence = response.length;
        // alert(this.totalLocataireParAgence)
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  private getNbreLocataireActif(agence: any) {
    this.statistique.getAlllocataireAyantBail(agence).subscribe(
      (resp: LocataireEncaisDTO[]) => {
        this.locatairesAvecBauxActifs = resp ?? [];
        this.refreshFilteredLeaseKpis();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  private getNbrebauxNonActif(agence: any) {
    this.statistique.getAllBauxNonActif(agence).subscribe(
      (resp) => {
        this.totalBauxNonActif = resp;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  private refreshDashboardKpis(): void {
    if (!this.user?.idAgence) {
      return;
    }

    this.getNombreBienImmobiliers(0, this.user.idAgence);
    this.getNombreBienImmobiliersOqp(0, this.user.idAgence);
    this.getNbreLocataire(this.user.idAgence);
    this.getNbreLocataireActif(this.user.idAgence);
    this.getNbrebauxNonActif(this.user.idAgence);
  }

  private refreshFilteredLeaseKpis(): void {
    const filteredLocataires = this.locatairesAvecBauxActifs ?? [];

    this.totalLocatireActifParAgence = this.countDistinct(
      filteredLocataires.map((locataire) => locataire.id)
    );
    this.totalBailActif = this.countDistinct(
      filteredLocataires.map((locataire) => locataire.idBail)
    );
  }

  private countDistinct(values: Array<number | undefined>): number {
    return new Set(
      values.filter((value): value is number => typeof value === 'number')
    ).size;
  }
  /*CHART DATA*/
  chart: any;
  isButtonVisible = false;

  visitorsChartDrilldownHandler = (e: any) => {
    this.chart.options = this.visitorsDrilldownedChartOptions;
    this.chart.options.data = this.options[e.dataPoint.name];
    this.chart.options.title = { text: e.dataPoint.name };
    this.chart.render();
    this.isButtonVisible = true;
  };

  visitorsDrilldownedChartOptions = {
    animationEnabled: true,
    theme: 'light2',
    axisY: {
      gridThickness: 0,
      lineThickness: 1,
    },
    data: [],
  };

  newVSReturningVisitorsOptions = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'New vs Loyer payés',
    },
    subtitles: [
      {
        text: 'Click on Any Segment to Drilldown',
        backgroundColor: '#2eacd1',
        fontSize: 16,
        fontColor: 'white',
        padding: 5,
      },
    ],
    data: [],
  };

  options: data = {
    'New vs Loyer payés': [
      {
        type: 'pie',
        name: 'New vs Loyer payés',
        startAngle: 90,
        cursor: 'pointer',
        explodeOnClick: false,
        showInLegend: true,
        legendMarkerType: 'square',
        click: this.visitorsChartDrilldownHandler,
        indexLabelPlacement: 'inside',
        indexLabelFontColor: 'white',
        dataPoints: [
          {
            y: 551160,
            name: 'Loyers impayés ',
            color: '#058dc7',
            indexLabel: '62.56%',
          },
          {
            y: 329840,
            name: 'Loyer payés',
            color: '#50b432',
            indexLabel: '37.44%',
          },
        ],
      },
    ],
    'Loyers impayés ': [
      {
        color: '#058dc7',
        name: 'Loyers impayés ',
        type: 'column',
        dataPoints: [
          { label: 'Jan', y: 42600 },
          { label: 'Feb', y: 44960 },
          { label: 'Mar', y: 46160 },
          { label: 'Apr', y: 48240 },
          { label: 'May', y: 48200 },
          { label: 'Jun', y: 49600 },
          { label: 'Jul', y: 51560 },
          { label: 'Aug', y: 49280 },
          { label: 'Sep', y: 46800 },
          { label: 'Oct', y: 57720 },
          { label: 'Nov', y: 59840 },
          { label: 'Dec', y: 54400 },
        ],
      },
    ],
    'Loyer payés': [
      {
        color: '#50b432',
        name: 'Loyer payés',
        type: 'column',
        dataPoints: [
          { label: 'Jan', y: 21800 },
          { label: 'Feb', y: 25040 },
          { label: 'Mar', y: 23840 },
          { label: 'Apr', y: 24760 },
          { label: 'May', y: 25800 },
          { label: 'Jun', y: 26400 },
          { label: 'Jul', y: 27440 },
          { label: 'Aug', y: 29720 },
          { label: 'Sep', y: 29200 },
          { label: 'Oct', y: 31280 },
          { label: 'Nov', y: 33160 },
          { label: 'Dec', y: 31400 },
        ],
      },
    ],
  };

  handleClick(event: Event) {
    this.chart.options = this.newVSReturningVisitorsOptions;
    this.chart.options.data = this.options['New vs Loyer payés'];
    this.chart.render();
    this.isButtonVisible = false;
  }

  getChartInstance(chart: object) {
    this.chart = chart;
    this.chart.options = this.newVSReturningVisitorsOptions;
    this.chart.options.data = this.options['New vs Loyer payés'];
    this.chart.render();
  }
  /** FIN DATA */
}
