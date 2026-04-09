import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap,tap } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ApiService } from 'src/gs-api/src/services';
import { BailVillaActions, BailVillaActionsTypes, SaveBailVillaActionsError, SaveBailVillaActionsSuccess } from './bailvilla.actions';

@Injectable()
export class BailVillaEffects {
  constructor(private apiService: ApiService, private effectActions: Actions, private notificationService: NotificationService) { }

  //SAVE EFFECTS
  saveBailVillaEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(BailVillaActionsTypes.SAVE_BAIL_VILLA),
      mergeMap((action: BailVillaActions) => {
        return this.apiService.saveBailVilla(action.payload).pipe(
          map((bailvilla) => new SaveBailVillaActionsSuccess(bailvilla)),
          catchError((err) => of(new SaveBailVillaActionsError(err.message)))
        );
      }),
      tap((studioCollection) => {

        console.log("Paylof",studioCollection.payload.valueOf());
        console.log("Paylof string",studioCollection.payload.toString());
        if (studioCollection.payload != null) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Création du Bail immobilier éffectuée avec succes!'
          );
        } else {
          this.sendErrorNotification(NotificationType.ERROR, '');
        }
      })
    )
  );
      //MESSAGE NOTIFICATION
      private sendErrorNotification(notificationType: NotificationType, message: string): void {
        if (message) {
          this.notificationService.notify(notificationType, message);
        } else {
          this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
        }
      }
}
