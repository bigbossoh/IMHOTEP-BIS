import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAllLocatairesBailActions } from 'src/app/ngrx/utulisateur/utilisateur.actions';
import {
  UtilisteurState,
  UtilisteurStateEnum,
} from 'src/app/ngrx/utulisateur/utlisateur.reducer';

@Component({
  standalone: false,
  selector: 'app-page-locataire',
  templateUrl: './page-locataire.component.html',
  styleUrls: ['./page-locataire.component.css'],
})
export class PageLocataireComponent implements OnInit {
  locataireState$: Observable<UtilisteurState> | null = null;
  readonly UtilisteurStateEnum = UtilisteurStateEnum;
  constructor(private store: Store<any>) {}

  ngOnInit(): void {
    this.store.dispatch(new GetAllLocatairesBailActions({}));
    this.locataireState$ = this.store.pipe(
      map((state) => state.locataireState)
    );
  }
}
