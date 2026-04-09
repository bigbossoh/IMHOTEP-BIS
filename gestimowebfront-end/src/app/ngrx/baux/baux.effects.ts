import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ApiService } from 'src/gs-api/src/services';
import {
  SupprimerOperationActionsSuccess,
  SupprimerOperationActionsError,
  FindBailByIdActionsSuccess,
  FindBailByIdActionsError,
  ModifierBailActionsSuccess,
  ModifierBailActionsError,
} from './baux.actions';
import {
  ClotureOperationActionsError,
  ClotureOperationActionsSuccess,
  GetAllOperationActionsError,
  GetAllOperationActionsSuccess,
  OperationActions,
  OperationActionsTypes,
  GetAllBientaireByLocatairesActionsSuccess,
  GetAllBientaireByLocatairesActionsError,
} from './baux.actions';

@Injectable()
export class BauxEffects {
  constructor(
    private apiService: ApiService,
    private effectActions: Actions,
    private notificationService: NotificationService
  ) {}

  //LISTE DES BAUX
  getAllBauxEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(OperationActionsTypes.GET_ALL_BAIL),
      mergeMap((actions: OperationActions) => {
        return this.apiService.findAllOperations(actions.payload).pipe(
          map((operations) => new GetAllOperationActionsSuccess(operations)),
          catchError((err) => of(new GetAllOperationActionsError(err.message)))
        );
      })
    )
  );

  // CLOTURE DES BAUX
  clotureBauxEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(OperationActionsTypes.CLOTURE_BAIL),
      mergeMap((action: OperationActions) => {
        return this.apiService.clotureBail(action.payload).pipe(
          map((operations) => new ClotureOperationActionsSuccess(operations)),
          catchError((err) => of(new ClotureOperationActionsError(err.message)))
        );
      }),
      tap((resultat) => {
        console.log('Resultat effect save Agence', resultat);
        if (resultat.type == OperationActionsTypes.CLOTURE_BAIL_SUCCES) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Le Bail a été cloturé avec succès.'
          );
        } else {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Une erreur a été rencontrée.'
          );
        }
      })
    )
  );
  //FIND BAIL BY ID
  findBailByIdEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(OperationActionsTypes.FIND_BAIL_BY_ID),
      mergeMap((action: OperationActions) => {
        return this.apiService.findOperationById(action.payload).pipe(
          map((operations) => new FindBailByIdActionsSuccess(operations)),
          catchError((err) => of(new FindBailByIdActionsError(err.message)))
        );
      }),
      tap((resultat) => {
        console.log('Resultat effect save Agence', resultat);
        if (resultat.type == OperationActionsTypes.FIND_BAIL_BY_ID_SUCCES) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Le Bail a été cloturé avec succès.'
          );
        } else {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Une erreur a été rencontrée.'
          );
        }
      })
    )
  );
  // MODIFIER BAIL
  modifierBailEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(OperationActionsTypes.MODIFIER_BAIL),
      mergeMap((action: OperationActions) => {
        return this.apiService.modifierUnBail(action.payload).pipe(
          map((operations) => new ModifierBailActionsSuccess(operations)),
          catchError((err) => of(new ModifierBailActionsError(err.message)))
        );
      }),
      tap((resultat) => {

        if (resultat.type == OperationActionsTypes.MODIFIER_BAIL_SUCCES) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Le Bail a été modifié avec succès.'
          );
        } else {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Une erreur a été rencontrée.'
          );
        }
      })
    )
  );
  // CLOTURE DES BAUX
  supprimerBauxEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(OperationActionsTypes.SUPPRIMER_BAIL),
      mergeMap((action: OperationActions) => {
        return this.apiService.supprimerBail(action.payload).pipe(
          map((bail) => new SupprimerOperationActionsSuccess(bail)),
          catchError((err) =>
            of(new SupprimerOperationActionsError(err.message))
          )
        );
      }),
      tap((resultat) => {
        if (resultat.type == OperationActionsTypes.SUPPRIMER_BAIL_SUCCES) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Le Bail a été suprimé avec succès.'
          );
        } else {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Une erreur a été rencontrée.'
          );
        }
      })
    )
  );
  // BAIL DU LOCATAIRE
  getAllBienByLocataireEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(OperationActionsTypes.GET_ALL_BIEN_BAIL_BY_LOCATAIRE),
      mergeMap((action: OperationActions) => {
        return this.apiService.listDesBauxPourUnLocataire(action.payload).pipe(
          map(
            (operations) =>
              new GetAllBientaireByLocatairesActionsSuccess(operations)
          ),
          catchError((err) =>
            of(new GetAllBientaireByLocatairesActionsError(err.message))
          )
        );
      }),
      tap((resultat) => {

        if (resultat.type == OperationActionsTypes.GET_ALL_BIEN_BAIL_BY_LOCATAIRE_ERROR) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            resultat.payload.toString()
          );
        }
        if (resultat.type == OperationActionsTypes.GET_ALL_BIEN_BAIL_BY_LOCATAIRE_SUCCES) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Opération éffectuée avec succès.'
          );
        }
      })
    )
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
