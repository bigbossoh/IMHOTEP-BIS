import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { UserService } from 'src/app/services/user/user.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ApiService } from 'src/gs-api/src/services';
import { GetMagasinByIdActionsSuccess } from './magasin.actions';
import {
  GetAllMagasinActionsSuccess,
  GetAllMagasinActionsError,
  GetMagasinByIdActionsError,
} from './magasin.actions';
import {
  GetAllMagasinLibreActionsSuccess,
  GetAllMagasinLibreActionsError,
  MagasinActions,
  MagasinActionsTypes,
  SaveMagasinActionsSuccess,
  SaveMagasintActionsError,
} from './magasin.actions';

@Injectable()
export class MagasinEffects {

  constructor(
    private apiService: ApiService,
    private effectActions: Actions,

    private notificationService: NotificationService
  ) {

  }

  //SAVE EFFECTS
  saveMagasinEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(MagasinActionsTypes.SAVE_MAGASIN),
      mergeMap((action: MagasinActions) => {
        return this.apiService.saveMagasinReturnDto(action.payload).pipe(
          map((magasin) => new SaveMagasinActionsSuccess(magasin)),
          catchError((err) => of(new SaveMagasintActionsError(err.message)))
        );
      }),
      tap((resultat) => {
        if (resultat.type == MagasinActionsTypes.SAVE_MAGASIN_SUCCES) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'La création du Magasin a été effectuée avec succès'
          );
        } else {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Une erreur a été rencontrée'
          );
        }
      })
    )
  );
  //GET MAGASIN BY ID EFFECTS
  getMagasinByIdEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(MagasinActionsTypes.GET_MAGASIN_BY_ID),
      mergeMap((action: MagasinActions) => {
        return this.apiService.findByIDMagasin(action.payload).pipe(
          map((magasin) => new GetMagasinByIdActionsSuccess(magasin)),
          catchError((err) => of(new GetMagasinByIdActionsError(err.message)))
        );
      }),
      tap((resultat) => {
        if (resultat.type == MagasinActionsTypes.GET_MAGASIN_BY_ID_SUCCES) {
          // this.sendErrorNotification(
          //   NotificationType.SUCCESS,
          //   'La création du Magasin a été effectuée avec succès'
          // );
        } else {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Une erreur a été rencontrée'
          );
        }
      })
    )
  );
  //LISTE DES MAGASINS LIBRES
  getAllMagasinsLibreEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(MagasinActionsTypes.GET_ALL_MAGASIN_LIBRE),
      mergeMap((actions: MagasinActions) => {
     
        return this.apiService.findAllMagasinLibre(actions.payload).pipe(
          map((magasin) => new GetAllMagasinLibreActionsSuccess(magasin)),
          catchError((err) =>
            of(new GetAllMagasinLibreActionsError(err.message))
          )
        );
      })
    )
  );
  //LISTE DES MAGASINS
  getAllMagasinsEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(MagasinActionsTypes.GET_ALL_MAGASIN),
      mergeMap((action:MagasinActions) => {
        return this.apiService.findAllMagasin(action.payload).pipe(
          map((magasin) => new GetAllMagasinActionsSuccess(magasin)),
          catchError((err) => of(new GetAllMagasinActionsError(err.message)))
        );
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
