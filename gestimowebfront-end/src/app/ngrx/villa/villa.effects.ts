import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ApiService } from 'src/gs-api/src/services';
import {
  GetAllVillaActionsSuccess,
  GetAllVillaActionsError,
  GetVillaByIdActionsSuccess,
  GetVillaByIdActionsError,
} from './villa.action';
import {
  GetAllVillaLibreActionsError,
  GetAllVillaLibreActionsSuccess,
  SaveVillaActionsError,
  SaveVillaActionsSuccess,
  VillaActions,
  VillaActionsTypes,
} from './villa.action';

@Injectable()
export class VillaEffects {

  constructor(
    private apiService: ApiService,

    private effectActions: Actions,
    private notificationService: NotificationService
  ) {

  }

  //SAVE EFFECTS
  saveVillaEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(VillaActionsTypes.SAVE_VILLA),
      mergeMap((action: VillaActions) => {
        return this.apiService.saveVilla(action.payload).pipe(
          map((villa) => new SaveVillaActionsSuccess(villa)),
          catchError((err) => of(new SaveVillaActionsError(err.message)))
        );
      }),
      tap((resultat) => {
        if (resultat.type == VillaActionsTypes.SAVE_VILLA_SUCCES) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            "L'opération éffectuée avec succes!"
          );
        }
      if  (resultat.type == VillaActionsTypes.SAVE_VILLA_ERROR) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            resultat.payload.toString()
          );
        }
      })
    )
  );
  //SAVE EFFECTS
  getVillaByIdEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(VillaActionsTypes.GET_VILLA_BY_ID),
      mergeMap((action: VillaActions) => {
        return this.apiService.findVillaById(action.payload).pipe(
          map((villa) => new GetVillaByIdActionsSuccess(villa)),
          catchError((err) => of(new GetVillaByIdActionsError(err.message)))
        );
      }),
      tap((resultat) => {
        if (resultat.type == VillaActionsTypes.GET_VILLA_BY_ID_SUCCES) {
          this.sendErrorNotification(NotificationType.SUCCESS, "L'opération éffectuée avec succes!");
        }
        if (resultat.type == VillaActionsTypes.GET_VILLA_BY_ID_ERROR)  {
          this.sendErrorNotification(
            NotificationType.ERROR,
            resultat.payload.toString()
          );
        }
      })
    )
  );
  //LISTE DES VILLA  LIBRE
  getAllVillasLibreEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(VillaActionsTypes.GET_ALL_VILLA_LIBRE),
      mergeMap((actions: VillaActions) => {

        return this.apiService.findAllVillaLibre(actions.payload).pipe(
          map((villas) => new GetAllVillaLibreActionsSuccess(villas)),
          catchError((err) => of(new GetAllVillaLibreActionsError(err.message)))
        );
      })
    )
  );
  //LISTE DES VILLA
  getAllVillasEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(VillaActionsTypes.GET_ALL_VILLA),
      mergeMap((actions:VillaActions) => {
        return this.apiService.findAllVilla(actions.payload).pipe(
          map((villas) => new GetAllVillaActionsSuccess(villas)),
          catchError((err) => of(new GetAllVillaActionsError(err.message)))
        );
      })
    )
  );

  //MESSAGE NOTIFICATION
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
