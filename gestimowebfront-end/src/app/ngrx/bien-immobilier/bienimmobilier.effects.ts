import { NotificationService } from 'src/app/services/notification/notification.service';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';
import { UserService } from 'src/app/services/user/user.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/gs-api/src/services';
import {
  BienImmobilierActions,
  BienImmobilierActionsTypes,
  GetAllBiensActionsError,
  GetAllBiensActionsSuccess,
  RattacherBiensChapitreActionsError,
  RattacherBiensChapitreActionsSuccess,
} from './bienimmobilier.actions';

@Injectable()
export class BienEffects {

  constructor(private apiService: ApiService,
    private userService: UserService,
    private effectActions: Actions,
    private notificationService: NotificationService) { }
  getAllBienseffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(BienImmobilierActionsTypes.GET_ALL_BIENS),
      mergeMap((actions: BienImmobilierActions) => {

        return this.apiService.findAllBien(actions.payload).pipe(
          map((biens) => new GetAllBiensActionsSuccess(biens)),
          catchError((err) => of(new GetAllBiensActionsError(err.message)))
        );
      })
    )
  );

  rattacherBienChapitreseffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(BienImmobilierActionsTypes.RATTACHER_BIEN_CHAPITRE),
      mergeMap((actions: BienImmobilierActions) =>
      {

        return this.apiService.rattacherUnBienAUnChapitre(actions.payload).pipe(
          map((biens) => new RattacherBiensChapitreActionsSuccess(biens)),
          catchError((err) => of(new RattacherBiensChapitreActionsError(err.message)))
        );
      }),
      tap((resultat) =>
      {
        if (
          resultat.type == BienImmobilierActionsTypes.RATTACHER_BIEN_CHAPITRE_BIENS_SUCCES
        )
        {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Le Bien a été modifié avec succès.'
          );
        }
        if (resultat.type == BienImmobilierActionsTypes.RATTACHER_BIEN_CHAPITRE_BIENS_ERROR)
        {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Une erreur a été rencontrée: ' + resultat.payload
          );
        }

      }) )
  );
   // Notification
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
