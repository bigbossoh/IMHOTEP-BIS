import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ApiService } from 'src/gs-api/src/services';
import { BailMagasinActions, BailMagasinActionsTypes, SaveBailMagasinActionsError, SaveBailMagasinActionsSuccess } from './bailmagasin.actions';

@Injectable()
export class BailMagasinEffects {
  constructor(private apiService: ApiService, private effectActions: Actions) { }

  //SAVE EFFECTS
  saveMagasinEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(BailMagasinActionsTypes.SAVE_BAIL_MAGASIN),
      mergeMap((action: BailMagasinActions) => {
        return this.apiService.saveBailMagasin(action.payload).pipe(
          map((bailmagsin) => new SaveBailMagasinActionsSuccess(bailmagsin)),
          catchError((err) => of(new SaveBailMagasinActionsError(err.message)))
        );
      })
    )
  );
}
