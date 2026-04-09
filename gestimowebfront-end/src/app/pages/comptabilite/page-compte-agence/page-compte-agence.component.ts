import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListClotureCaisseActions } from 'src/app/ngrx/cloture-caisse/cloturecaisse.actions';
import {
  ClotureCaisseState,
  ClotureCaisseStateEnum,
} from 'src/app/ngrx/cloture-caisse/cloturecaisse.reducer';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';

@Component({
  standalone: false,
  selector: 'app-page-compte-agence',
  templateUrl: './page-compte-agence.component.html',
  styleUrls: ['./page-compte-agence.component.css'],
})
export class PageCompteAgenceComponent implements OnInit {
  saveClotureCaisseState$: Observable<ClotureCaisseState> | null = null;
  readonly ClotureCaisseStateEnum = ClotureCaisseStateEnum;
  displayedColumns = [
    'caissiere',
    'dateDeDCloture',
    'intervalNextCloture',

    'totalEncaisse',
  ];
  @ViewChild('paginatorEncaissenent') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  pageSizeAppel = [5, 10, 15, 20, 40];
  public user?: UtilisateurRequestDto;
  constructor(private store: Store<any>) {}

  ngOnInit(): void {
    this.store.dispatch(new ListClotureCaisseActions({}));
    this.saveClotureCaisseState$ = this.store.pipe(
      map((state) => state.clotuteCaisseState)
    );
    this.store
      .pipe(map((state) => state.clotuteCaisseState))
      .subscribe((data) => {
        this.dataSource.data = [];
        this.dataSource.paginator = null;
        if (data.dataState == 'Loaded') {
          this.dataSource.data = data.listClotureCaisse;
          this.dataSource.paginator = this.paginator;
        }
        console.log('**** the cloture ****');
        console.log(data);
        console.log('***************');
      });
  }
  applyFilterAppel(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
