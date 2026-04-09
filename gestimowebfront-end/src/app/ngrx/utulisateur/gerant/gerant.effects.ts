import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from 'src/gs-api/src/services';
import { NotificationService } from '../../../services/notification/notification.service';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  GerantActionsTypes,
  GetAllGerantsActionsSucces,
  GetAllGerantsActionsError,
  GerantActions,
  GetAllClientHotelActionsSucces,
  GetAllClientHotelActionsError,
} from './gerant.actions';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';

@Injectable()
export class GerantEffects {
  constructor(
    private apiService: ApiService,
    private effectActions: Actions,

    private notificationService: NotificationService
  ) {}
  getAllGerantsEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(GerantActionsTypes.GET_ALL_GERANTS),
      mergeMap((actions: GerantActions) => {
        return this.apiService.getAllGerantsByOrder(actions.payload).pipe(
          map((gerants) => new GetAllGerantsActionsSucces(gerants)),
          catchError((err) => of(new GetAllGerantsActionsError(err.message)))
        );
      }),
      tap((gerant) => {
        if (gerant.payload.indexOf('Error') < 0) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'La liste des gérants a été chargées avec succès'
          );
        } else {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Une erreur a été rencontré'
          );
        }
      })
    )
  );
  getAllClienthotelEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(GerantActionsTypes.GET_ALL_HOTEL),
      mergeMap((actions: GerantActions) => {
        console.log("**** the payload is : ");
        console.log(actions.payload);
        return this.apiService
          .listOfAllUtilisateurClientHotelOrderbyNameByAgence(actions.payload)
          .pipe(
            map((gerants) => new GetAllClientHotelActionsSucces(gerants)),
            catchError((err) =>
              of(new GetAllClientHotelActionsError(err.message))
            )
          );
      }),
      tap((gerant) => {
        if (gerant.type == GerantActionsTypes.GET_ALL_HOTEL_ERROR) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'ERREUR' + gerant.payload.toString()
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
