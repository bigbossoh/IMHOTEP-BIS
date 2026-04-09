import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/gs-api/src/services';
import {
  BailAppartementActionsTypes,
  BailAppartementnActions,
  SaveBailAppartementActionsError,
  SaveBailAppartementActionsSuccess,
} from './bailappartement.actions';
import { NotificationType } from '../../enum/natification-type.enum';
import { NotificationService } from '../../services/notification/notification.service';

@Injectable()
export class BailAppartementEffects {
  constructor(
    private apiService: ApiService,
    private effectActions: Actions,
    private notificationService: NotificationService
  ) {}

  //SAVE EFFECTS
  saveBailAppartementEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(BailAppartementActionsTypes.SAVE_BAIL_APPARTEMENT),
      mergeMap((action: BailAppartementnActions) => {
        return this.apiService.saveBailAppartement(action.payload).pipe(
          map(
            (bailappartment) =>
              new SaveBailAppartementActionsSuccess(bailappartment)
          ),
          catchError((err) =>
            of(new SaveBailAppartementActionsError(err.message))
          )
        );
      }),
      tap((resultat) => {
        if (
          resultat.type ==
          BailAppartementActionsTypes.SAVE_BAIL_APPARTEMENT_SUCCES
        ) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Opération a été effectuée avec succès'
          );
        } else {
          this.sendErrorNotification(
            NotificationType.ERROR,
            resultat.payload.toString()
          );
        }
      })
    )
  );
  private sendErrorNotification(
    notificationType: NotificationType,
    message: string
  ): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(
        notificationType,
        'An error occurred. Please try again.'
      );
    }
  }
}
