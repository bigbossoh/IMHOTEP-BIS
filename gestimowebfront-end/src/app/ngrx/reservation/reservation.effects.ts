import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, forkJoin, of } from 'rxjs';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ApiService } from 'src/gs-api/src/services';
import {
  GetListEncaissementReservationBienAction,
  GetListEncaissementReservationBienActionError,
  GetListEncaissementReservationBienActionSuccess,
  GetListReservationActionsError,
  GetListReservationActionsSuccess,
  GetListReservationOuvertActionsError,
  GetListReservationOuvertActionsSuccess,
  ReservationActionTypes,
  ReservationActions,
  SaveEncaissementReservationActionsError,
  SaveEncaissementReservationActionsSuccess,
  SaveReservationActionsError,
  SaveReservationActionsSuccess,
} from './reservation.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { EncaissementActionsTypes } from '../reglement/reglement.actions';
import { SaveReductionActionsSuccess } from '../appelloyer/appelloyer.actions';

@Injectable()
export class ReservationEffects {
  constructor(
    private apiService: ApiService,
    private effectActions: Actions,
    private notificationService: NotificationService
  ) {}
  listReservationOuverEffect: Observable<Action> = createEffect(() =>
  this.effectActions.pipe(
    ofType(ReservationActionTypes.GET_LISTE_RESERVATION_OUVERT),
    mergeMap((action: ReservationActions) => {
      return this.apiService.listeDesReservationOuvertParAgence(action.payload).pipe(
        map((quartier) => new GetListReservationOuvertActionsSuccess(quartier)),
        catchError((err) =>
          of(new GetListReservationOuvertActionsError(err.message))
        )
      );
    }),
    tap((resultat) => {
      if (
        resultat.type == ReservationActionTypes.GET_LISTE_RESERVATION_OUVERT_ERROR
      ) {
        this.sendErrorNotification(NotificationType.ERROR, resultat.payload);
      }
    })
  )
);
saveEncaissementReservationEffect: Observable<Action> = createEffect(() =>
this.effectActions.pipe(
  ofType(ReservationActionTypes.SAVE_ENCAISSEMENT_RESERVATION),
  mergeMap((action: ReservationActions) => {

    return this.apiService.saveencaissementreservation(action.payload).pipe(
      map((quartier) => new SaveEncaissementReservationActionsSuccess(quartier)),
      catchError((err) =>
        of(new SaveEncaissementReservationActionsError(err.message))
      )
    );
  }),
  tap((resultat) => {
    if (
      resultat.type == ReservationActionTypes.SAVE_ENCAISSEMENT_RESERVATION_ERROR
    ) {
      this.sendErrorNotification(NotificationType.ERROR, resultat.payload);
    }
  })
)
);
  listReservationEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(ReservationActionTypes.GET_LISTE_RESERVATION),
      mergeMap((action: ReservationActions) => {
        return this.apiService.allreservationparagence(action.payload).pipe(
          map((quartier) => new GetListReservationActionsSuccess(quartier)),
          catchError((err) =>
            of(new GetListReservationActionsError(err.message))
          )
        );
      }),
      tap((resultat) => {
        if (
          resultat.type == ReservationActionTypes.GET_LISTE_RESERVATION_ERROR
        ) {
          this.sendErrorNotification(NotificationType.ERROR, resultat.payload);
        }
      })
    )
  );
  saveReservationEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(ReservationActionTypes.SAVE_RESERVATION),
      mergeMap((action: ReservationActions) => {
        const payload = (action as any).payload ?? {};
        const reservationRequest = payload.reservation ?? payload;
        const shouldSyncPrestations = Object.prototype.hasOwnProperty.call(
          payload,
          'prestationIds'
        );
        const prestationIds: number[] = Array.isArray(payload.prestationIds)
          ? payload.prestationIds
          : [];

        return this.apiService.saveorupdatereservation(reservationRequest).pipe(
          mergeMap((savedReservation) => {
            const reservationId = (savedReservation as any)?.id;
            if (!reservationId || !shouldSyncPrestations) {
              return of(new SaveReservationActionsSuccess(savedReservation));
            }

            return this.apiService.findAllServiceAdditionnelPrestationAdditionnel().pipe(
              mergeMap((links) => {
                const allLinks = Array.isArray(links) ? links : [];
                const reservationIdNumber = Number(reservationId);
                const existingLinks = allLinks.filter(
                  (link) =>
                    Number((link as any)?.idReservation) === reservationIdNumber
                );

                const existingServiceIds = new Set<number>(
                  existingLinks
                    .map((link) => Number((link as any)?.idServiceAdditionnelle))
                    .filter((id) => Number.isFinite(id) && id > 0)
                );

                const desiredServiceIds = new Set<number>(
                  prestationIds
                    .map((id) => Number(id))
                    .filter((id) => Number.isFinite(id) && id > 0)
                );

                const toAdd = Array.from(desiredServiceIds).filter((id) => !existingServiceIds.has(id));
                const toRemove = existingLinks.filter((link) => {
                  const linkId = Number((link as any)?.id);
                  const serviceId = Number((link as any)?.idServiceAdditionnelle);
                  return (
                    Number.isFinite(linkId) &&
                    linkId > 0 &&
                    Number.isFinite(serviceId) &&
                    serviceId > 0 &&
                    !desiredServiceIds.has(serviceId)
                  );
                });

                const operations: Array<Observable<unknown>> = [];

                for (const link of toRemove) {
                  operations.push(this.apiService.deleteServiceAdditionnelPrestationAdditionnel(Number((link as any).id)));
                }

                for (const serviceId of toAdd) {
                  operations.push(
                    this.apiService.saveorupdatePrestationAdditionnel({
                      id: 0,
                      idAgence: reservationRequest?.idAgence,
                      idCreateur: reservationRequest?.idCreateur,
                      idReservation: reservationId,
                      idServiceAdditionnelle: serviceId,
                    } as any)
                  );
                }

                if (!operations.length) {
                  return of(new SaveReservationActionsSuccess(savedReservation));
                }

                return forkJoin(operations).pipe(
                  map(() => new SaveReservationActionsSuccess(savedReservation)),
                  catchError(() => {
                    this.sendErrorNotification(
                      NotificationType.ERROR,
                      'Réservation enregistrée, mais impossible de synchroniser les prestations.'
                    );
                    return of(new SaveReservationActionsSuccess(savedReservation));
                  })
                );
              }),
              catchError(() => {
                this.sendErrorNotification(
                  NotificationType.ERROR,
                  'Réservation enregistrée, mais impossible de charger les prestations.'
                );
                return of(new SaveReservationActionsSuccess(savedReservation));
              })
            );
          }),
          catchError((err) => of(new SaveReservationActionsError(err.message)))
        );
      }),
      tap((resultat) => {
        if (resultat.type == ReservationActionTypes.SAVE_RESERVATION_SUCCES) {
          this.sendErrorNotification(NotificationType.SUCCESS, "Enregistrement effectué avec succes.");
        }
        if (resultat.type == ReservationActionTypes.SAVE_RESERVATION_ERROR) {
          this.sendErrorNotification(NotificationType.ERROR, resultat.payload.toString());
        }
      })
    )
  );

  listEncaisseReservBienEffect: Observable<Action> = createEffect(() =>
  this.effectActions.pipe(
    ofType(ReservationActionTypes.GET_LISTE_ENCAISSEMENT_RESERVATION_BIEN),
    mergeMap((action: ReservationActions) => {
      return this.apiService.findAllEncaissementReservationByIdBien(action.payload).pipe(
        map((quartier) => new GetListEncaissementReservationBienActionSuccess(quartier)),
        catchError((err) =>
          of(new GetListEncaissementReservationBienActionError(err.message))
        )
      );
    }),
    tap((resultat) => {
      if (
        resultat.type == ReservationActionTypes.GET_LISTE_RESERVATION_OUVERT_ERROR
      ) {
        this.sendErrorNotification(NotificationType.ERROR, resultat.payload);
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
