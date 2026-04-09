import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ApiService } from 'src/gs-api/src/services';
import { QuartierActions, QuartierActionsTypes, GetAllQuartierByCommuneActionsError, GetAllQuartierByCommuneActionsSuccess } from './quartier.actions';

@Injectable()
export class Quartierffects {
  constructor(private apiService: ApiService, private effectActions: Actions) { }
  getAllQuartierByIdCommuneEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(QuartierActionsTypes.GET_ALL_QUARTIER_BY_COMMUNE),
      mergeMap((action: QuartierActions) => {
        return this.apiService.findAllQuartierByIdCommune(action.payload).pipe(
          map((quartier) => new GetAllQuartierByCommuneActionsSuccess(quartier)),
          catchError((err) => of(new GetAllQuartierByCommuneActionsError(err.message)))
        );
      })
    )
  )
}

