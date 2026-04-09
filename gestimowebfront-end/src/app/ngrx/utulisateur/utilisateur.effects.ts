import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ApiService } from 'src/gs-api/src/services';
import {
  GetAllUtilisateursActionsSuccess,
  GetAllUtilisateursActionsError,
  SaveUserActionsSuccess,
  UtilisateurActions,
  SaveUserActionsError,
  GetAllLocatairesBailActionsSuccess,
  GetAllLocatairesBailActionsError,
} from './utilisateur.actions';
import {
  UtilisateurActionsTypes,
  GetAllProprietairesActionsError,
  GetAllProprietairesActionsSuccess,
  GetAllLocatairesActionsSuccess,
  GetAllLocatairesActionsError,
} from './utilisateur.actions';

@Injectable()
export class UtilisateurEffects {
  constructor(
    private apiService: ApiService,
    private effectActions: Actions,
    private notificationService: NotificationService
  ) {}
  //LISTE DES PROPRIETAIRES
  getAllProprietairesEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(UtilisateurActionsTypes.GET_ALL_PROPRIETAIRES),
      mergeMap((action: UtilisateurActions) => {
        return this.apiService.getAllProprietaireByOrder(action.payload).pipe(
          map(
            (proprietaires) =>
              new GetAllProprietairesActionsSuccess(proprietaires)
          ),
          catchError((err) =>
            of(new GetAllProprietairesActionsError(err.message))
          )
        );
      }),
      tap((proprio) => {
        if (
          (proprio.type = UtilisateurActionsTypes.GET_ALL_PROPRIETAIRES_ERROR)
        ) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            proprio.payload.toString()
          );
        }
      })
    )
  );

  //LISTE DES UTILISATEURS
  getAllUtilisateursEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(UtilisateurActionsTypes.GET_ALL_UTLISATEUR),
      mergeMap((actions: UtilisateurActions) => {
        return this.apiService.getAllUtilisateursByOrder(actions.payload).pipe(
          map(
            (proprietaires) =>
              new GetAllUtilisateursActionsSuccess(proprietaires)
          ),
          catchError((err) =>
            of(new GetAllUtilisateursActionsError(err.message))
          )
        );
      }),
      tap((proprio) => {
        if (proprio.type == UtilisateurActionsTypes.GET_ALL_UTLISATEUR_ERROR) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            proprio.payload.toString()
          );
        }
      })
    )
  );
  //LISTE DES LOCATAIRES BAILS
  getAllLocatairesBailEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(UtilisateurActionsTypes.GET_ALL_LOCATAIRES_BAIL),
      mergeMap((action: UtilisateurActions) => {
        return this.apiService.getAllLocatairesAvecBail(action.payload).pipe(
          map((locatires) => new GetAllLocatairesBailActionsSuccess(locatires)),
          catchError((err) =>
            of(new GetAllLocatairesBailActionsError(err.message))
          )
        );
      }),
      tap((locataire) => {
       // console.log('LE LOCA ......');

       // console.log(locataire.payload);

        if (
          locataire.type ==
          UtilisateurActionsTypes.GET_ALL_LOCATAIRES_BAIL_ERROR
        ) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            locataire.payload.toString()
          );
        }
      })
    )
  );

  //LISTE DES LOCATAIRES
  getAllLocatairesEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(UtilisateurActionsTypes.GET_ALL_LOCATAIRES),
      mergeMap((action: UtilisateurActions) => {
        return this.apiService.getAllLocatairesByOrder(action.payload).pipe(
          map((locatires) => new GetAllLocatairesActionsSuccess(locatires)),
          catchError((err) => of(new GetAllLocatairesActionsError(err.message)))
        );
      }),
      tap((locataire) => {
        if (
          locataire.type == UtilisateurActionsTypes.GET_ALL_LOCATAIRES_SUCCES
        ) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'La liste des locataires (' +
              locataire.payload.length +
              ')  a été chargées avec succès'
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
  //LISTE DES UTILISATEURS
  saveUtilisateursEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(UtilisateurActionsTypes.SAVE_USER),
      mergeMap((action: UtilisateurActions) => {
        return this.apiService.saveUtilisateur(action.payload).pipe(
          map((utilisateur) => new SaveUserActionsSuccess(utilisateur)),
          catchError((err) => of(new SaveUserActionsError(err.message)))
        );
      }),
      tap((utilisateur) => {
        console.log('le payload est le suivant USER : ');
        console.log(utilisateur.payload);

        if (utilisateur.type.indexOf('Error') < 0) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'La liste des locataires a été chargées avec succès'
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
