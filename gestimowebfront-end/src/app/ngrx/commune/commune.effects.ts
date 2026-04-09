import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ApiService } from 'src/gs-api/src/services';
import { CommunesActions, CommunesActionsTypes, GetAllCommunesByVilleActionsError, GetAllCommunesByVilleActionsSuccess } from './commune.actions';

@Injectable()
export class Communeffects {
  constructor(private apiService: ApiService, private effectActions: Actions) { }
  getAllEtageByImmeubleIdseffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(CommunesActionsTypes.GET_ALL_COMMUNE_BY_VILLE),
      mergeMap((action: CommunesActions) => {
        return this.apiService.findCommuneByIdPays(action.payload).pipe(
          map((communes) => new GetAllCommunesByVilleActionsSuccess(communes)),
          catchError((err) => of(new GetAllCommunesByVilleActionsError(err.message)))
        );
      })
    )
  );

}
