import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getAllSuperviseurAction } from 'src/app/ngrx/utulisateur/superviseur/superviseur.action';
import { SuperviseurState, SuperviseurStateEnum } from 'src/app/ngrx/utulisateur/superviseur/superviseur.reducer';

@Component({
  standalone: false,
  selector: 'app-page-superviseur',
  templateUrl: './page-superviseur.component.html',
  styleUrls: ['./page-superviseur.component.css']
})
export class PageSuperviseurComponent implements OnInit {

  superviseurState$: Observable<SuperviseurState> | null=null;
  readonly SuperviseurStateEnum=SuperviseurStateEnum;

  constructor(private store: Store<any>) { }

  ngOnInit(): void {
    this.store.dispatch(new getAllSuperviseurAction({}));
    this.superviseurState$=this.store.pipe(
      map((state)=>state.superviseurState)
    );
  }

}
