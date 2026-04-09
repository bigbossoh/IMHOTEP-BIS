import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from 'src/gs-api/src/services';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  AnneeActionsTypes,
  AnneeActions,
  GetAllAnneeActionsSuccess,
  GetAllAnneeActionsError,
} from './annee.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class AnneeEffects {

  constructor(
    private apiService: ApiService,
    private effectActions: Actions
  ) {

  }

  //LISTE DES APPEL LOYER
  getAllAppelEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AnneeActionsTypes.GET_ALL_ANNEE_PERIODE),
      mergeMap((action:AnneeActions) => {
        return this.apiService.listOfDistinctAnneeAppel(action.payload).pipe(
          map((appelloyers) => new GetAllAnneeActionsSuccess(appelloyers)),
          catchError((err) => of(new GetAllAnneeActionsError(err.message)))
        );
      })
    )
  );
}
