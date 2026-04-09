import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAllGerantsActions } from 'src/app/ngrx/utulisateur/gerant/gerant.actions';
import { GerantState } from 'src/app/ngrx/utulisateur/gerant/gerant.reducer';
import { GerantStateEnum } from '../../../../ngrx/utulisateur/gerant/gerant.reducer';

@Component({
  standalone: false,
  selector: 'app-page-gerant',
  templateUrl: './page-gerant.component.html',
  styleUrls: ['./page-gerant.component.css']
})
export class PageGerantComponent implements OnInit {

  gerantState$: Observable<GerantState> | null=null;
  readonly GerantStateEnum=GerantStateEnum;

  constructor(private store: Store<any>) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllGerantsActions({}));
    this.gerantState$=this.store.pipe(
      map((state)=>state.gerantState)
    );
  }

}
