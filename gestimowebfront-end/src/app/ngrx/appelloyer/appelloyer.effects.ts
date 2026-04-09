import { NotificationService } from './../../services/notification/notification.service';
import { NotificationType } from './../../enum/natification-type.enum';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/gs-api/src/services';
import {
  GetAllAppelLoyerByPeriodeActionsSuccess,
  GetAllAppelLoyerByPeriodeActionsError,
  GetAllAppelLoyerAnneeActionsSuccess,
  GetAllAppelLoyerAnneeActionsError,
  GetImayerLoyerParAnneeActionsSuccess,
  GetImayerLoyerParAnneeActionsError,
  GetPayerLoyerParAnneeActionsSuccess,
  GetPayerLoyerParAnneeActionsError,
  GetImpayerLoyerParPeriodeActionsError,
  GetImpayerLoyerParPeriodeActionsSuccess,
  GetPayerLoyerParPeriodeActionsSuccess,
  GetPayerLoyerParPeriodeActionsError,
  SaveReductionActionsSuccess,
  SaveReductionActionsError,
  GetAllAppelLoyerByBailActionsSuccess,
  GetAllAppelLoyerByBailActionsError,
  GetAllSmsByLocataireActionsSuccess,
  GetAllSmsByLocataireActionsError,
  SaveSupprimerActionsSuccess,
  SaveSupprimerActionsError,
  GetStatLoyerParPeriodeActionsSuccess,
  GetStatLoyerParPeriodeActionsError,
  GetStatLoyerParAnneeActionsSuccess,
  GetStatLoyerParAnneeActionsError,
} from './appelloyer.actions';
import {
  AppelLoyerctionsTypes,
  GetAllAppelLoyerActionsError,
  GetAllAppelLoyerActionsSuccess,
  AppelLoyerActions,
} from './appelloyer.actions';

@Injectable()
export class AppelLoyerEffects {
  constructor(
    private apiService: ApiService,
    private effectActions: Actions,
    private notificationService: NotificationService
  ) {}

  //LISTE DES APPEL LOYER
  getAllAppelEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppelLoyerctionsTypes.GET_ALL_APPELLOYER),
      mergeMap((action: AppelLoyerActions) => {
        return this.apiService.listDesLoyersParBail(action.payload).pipe(
          map((appelloyers) => new GetAllAppelLoyerActionsSuccess(appelloyers)),
          catchError((err) => of(new GetAllAppelLoyerActionsError(err.message)))
        );
      })
    )
  );
  getImpayerParPeriodeEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_PERIODE),
      mergeMap((action: AppelLoyerActions) => {
        return this.apiService.impayeLoyerParMoisAppelLoyer(action.payload).pipe(
          map(
            (appello) =>
              new GetImpayerLoyerParPeriodeActionsSuccess(appello)
          ),
          catchError((err) =>
            of(new GetImpayerLoyerParPeriodeActionsError(err.message))
          )
        );
      })
    )
  );
  //STAT PERIODE
  getStatParPeriodeEffect: Observable<Action> = createEffect(() =>
  this.effectActions.pipe(
    ofType(AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_PERIODE),
    mergeMap((action: AppelLoyerActions) => {
      return this.apiService.staisiqueLoyerParMois(action.payload).pipe(
        map(
          (appelloyers) =>
            new GetStatLoyerParPeriodeActionsSuccess(appelloyers)
        ),
        catchError((err) =>
          of(new GetStatLoyerParPeriodeActionsError(err.message))
        )
      );
    })
  )
);
  //STAT ANNEE
  getStatParAnneeEffect: Observable<Action> = createEffect(() =>
  this.effectActions.pipe(
    ofType(AppelLoyerctionsTypes.GET_STAT_LOYER_PAR_ANNEE),
    mergeMap((action: AppelLoyerActions) => {
      return this.apiService.statistiqueLoyerParAnnee(action.payload).pipe(
        map(
          (appelloyers) =>
            new GetStatLoyerParAnneeActionsSuccess(appelloyers)
        ),
        catchError((err) =>
          of(new GetStatLoyerParAnneeActionsError(err.message))
        )
      );
    })
  )
);
  //SIN STAT PERIODE
  getPayerParPeriodEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_PERIODE),
      mergeMap((action: AppelLoyerActions) => {
        return this.apiService.payeLoyerParMois(action.payload).pipe(
          map(
            (appelloyers) =>
              new GetPayerLoyerParPeriodeActionsSuccess(appelloyers)
          ),
          catchError((err) =>
            of(new GetPayerLoyerParPeriodeActionsError(err.message))
          )
        );
      })
    )
  );
  getImpayerParAnneeEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppelLoyerctionsTypes.GET_IMPAYER_LOYER_PAR_ANNEE),
      mergeMap((action: AppelLoyerActions) => {
        return this.apiService.impayeLoyerParAnnee(action.payload).pipe(
          map(
            (appelloyers) =>
              new GetImayerLoyerParAnneeActionsSuccess(appelloyers)
          ),
          catchError((err) =>
            of(new GetImayerLoyerParAnneeActionsError(err.message))
          )
        );
      })
    )
  );
  //GET LES PAYER PAR ANNEES
  getPayerParAnneeEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppelLoyerctionsTypes.GET_PAYER_LOYER_PAR_ANNEE),
      mergeMap((action: AppelLoyerActions) => {
        return this.apiService.payeLoyerParAnnee(action.payload).pipe(
          map(
            (appelloyers) =>
              new GetPayerLoyerParAnneeActionsSuccess(appelloyers)
          ),
          catchError((err) =>
            of(new GetPayerLoyerParAnneeActionsError(err.message))
          )
        );
      })
    )
  );
  // SAVE REDUCTION LOYER

  saveReductionLoyerPeriodeEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppelLoyerctionsTypes.SAVE_REDUCTION_LOYER),
      mergeMap((action: AppelLoyerActions) => {
        return this.apiService.ReductionLoyerByPeriode(action.payload).pipe(
          map((appelloyers) => new SaveReductionActionsSuccess(appelloyers)),
          catchError((err) => of(new SaveReductionActionsError(err.message)))
        );
      }),
      tap((resultat) => {
        if (
          resultat.type == AppelLoyerctionsTypes.SAVE_REDUCTION_LOYER_SUCCES
        ) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Le Bail a été modifié avec succès.'
          );
        }
        if (resultat.type == AppelLoyerctionsTypes.SAVE_REDUCTION_LOYER_ERROR) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Une erreur a été rencontrée: ' + resultat.payload
          );
        }
      })
    )
  );
    // SAVE REDUCTION LOYER

    saveSupprimerLoyerPeriodeEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppelLoyerctionsTypes.SAVE_SUPPRIMER_LOYER),
      mergeMap((action: AppelLoyerActions) => {
        return this.apiService.supprimerPaiementAppel(action.payload).pipe(
          map((appelloyers) => new SaveSupprimerActionsSuccess(appelloyers)),
          catchError((err) => of(new SaveSupprimerActionsError(err.message)))
        );
      }),
      tap((resultat) => {
        if (
          resultat.type == AppelLoyerctionsTypes.SAVE_SUPPRIMER_LOYER_SUCCES
        ) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            "L'encaissement a été annulé avec succès."
          );
          // alert("L'encaissement a été annulé avec succès.")
        }
        if (resultat.type == AppelLoyerctionsTypes.SAVE_SUPPRIMER_LOYER_ERROR) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Une erreur a été rencontrée: ' + resultat.payload
          );
        }
      })
    )
  );
  //LISTES DES APPEL LOYER PAR PERIODE
  //LISTE DES APPEL LOYER
  getAllAppelByPeriodeEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_PERIODE),
      mergeMap((action: AppelLoyerActions) => {
        return this.apiService.AppelLoyersParPeriode(action.payload).pipe(
          map(
            (appelloyers) =>
              new GetAllAppelLoyerByPeriodeActionsSuccess(appelloyers)
          ),
          catchError((err) =>
            of(new GetAllAppelLoyerByPeriodeActionsError(err.message))
          )
        );
      })
    )
  );

  //LISTE DES APPEL LOYER
  getAllAppelByAnneeEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppelLoyerctionsTypes.GET_ALL_APPELLOYER_ANNEE),
      mergeMap((action: AppelLoyerActions) => {
        return this.apiService
          .findAllPeriodeChiffreEtLettreByAnnee(action.payload)
          .pipe(
            map((annees) => new GetAllAppelLoyerAnneeActionsSuccess(annees)),
            catchError((err) =>
              of(new GetAllAppelLoyerAnneeActionsError(err.message))
            ),
            tap((resultat) => {
              console.log(
                'Le bon resultat est le suivant pour la reduction du bail'
              );
              console.log(resultat.type);

              if (
                resultat.type ==
                AppelLoyerctionsTypes.SAVE_REDUCTION_LOYER_SUCCES
              ) {
                this.sendErrorNotification(
                  NotificationType.SUCCESS,
                  'Le Bail a été modifié avec succès.'
                );
              }
              if (
                resultat.type ==
                AppelLoyerctionsTypes.SAVE_REDUCTION_LOYER_ERROR
              ) {
                this.sendErrorNotification(
                  NotificationType.ERROR,
                  'Une erreur a été rencontrée: ' + resultat.payload
                );
              }
            })
          );
      })
    )
  );

  // SAVE REDUCTION LOYER

  getAllAppelLoyerByBienEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_BAIL),
      mergeMap((action: AppelLoyerActions) => {
        return this.apiService.listDesLoyersParBail(action.payload).pipe(
          map(
            (appelloyers) =>
              new GetAllAppelLoyerByBailActionsSuccess(appelloyers)
          ),
          catchError((err) =>
            of(new GetAllAppelLoyerByBailActionsError(err.message))
          )
        );
      }),
      tap((resultat) => {
        if (
          resultat.type ==
          AppelLoyerctionsTypes.GET_ALL_APPELLOYER_BY_BAIL_ERROR
        ) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Une erreur a été rencontrée: ' + resultat.payload
          );
        }
      })
    )
  );

  //GAT ALL SMS SEND BY LOCATAIRE
  getAllSmsSendByLocataireEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppelLoyerctionsTypes.GET_ALL_SMS_BY_LOCATAIRE),
      mergeMap((action: AppelLoyerActions) => {
        return this.apiService
          .listMessageEnvoyerAUnLocataire(action.payload)
          .pipe(
            map((sms) => new GetAllSmsByLocataireActionsSuccess(sms)),
            catchError((err) =>
              of(new GetAllSmsByLocataireActionsError(err.message))
            )
          );
      }),
      tap((resultat) =>
      {
        console.log("le resultat pour les SMS sont les suivants ::::");
        console.log(resultat);


        if (
          resultat.type == AppelLoyerctionsTypes.GET_ALL_SMS_BY_LOCATAIRE_ERROR
        ) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Une erreur a été rencontrée: ' + resultat.payload
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

export function findAppelsByIdBail(payload: any) {
  throw new Error('Function not implemented.');
}
