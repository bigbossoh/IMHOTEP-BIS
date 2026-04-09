import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAllProprietairesActions } from 'src/app/ngrx/utulisateur/utilisateur.actions';
import {
  UtilisteurState,
  UtilisteurStateEnum,
} from 'src/app/ngrx/utulisateur/utlisateur.reducer';

@Component({
  standalone: false,
  selector: 'app-page-proprietaire',
  templateUrl: './page-proprietaire.component.html',
  styleUrls: ['./page-proprietaire.component.css'],
})
export class PageProprietaireComponent implements OnInit {
  proprietaireState$: Observable<UtilisteurState> | null = null;
  readonly UtilisteurStateEnum = UtilisteurStateEnum;
  constructor(private store: Store<any>) {}

  ngOnInit(): void {
    this.store.dispatch(new GetAllProprietairesActions({}));
    this.proprietaireState$ = this.store.pipe(
      map((state) => state.proprietaireState)
    );
  }
}
