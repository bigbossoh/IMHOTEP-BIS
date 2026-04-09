import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/gs-api/src/services';
import {
  EncaissementActionsTypes,
  EncaissementActions,
  SaveEncaissementActionsSuccess,
  SaveEncaissementActionsError,
  GetAllPeriodeReglementByBienActionsSuccess,
  GetAllPeriodeReglementByBienActionsError,
  GetLocataireEncaissementActionsSuccess,
  GetLocataireEncaissementActionsError,
  SaveEncaissementGroupeActionsSuccess,
  SaveEncaissementGroupeActionsError,
  TotalEncaissementEntreDeuxDatesActionsSuccess,
  TotalEncaissementEntreDeuxDatesActionsError,
  SommeEncaissementEntreDeuxDatesActionsSuccess,
  SommeEncaissementEntreDeuxDatesActionsError,
  SommeDuentreDeuxDatesActionsSuccess,
  SommeDueEntreDeuxDatesActionsError,
  GetAllEncaissementClotureActionsSuccess,
  GetAllEncaissementClotureActionsError,
} from './reglement.actions';
import { NotificationType } from '../../enum/natification-type.enum';
import { NotificationService } from '../../services/notification/notification.service';
import { OperationActions } from '../baux/baux.actions';
import {
  GetEncaissementBienActionsSuccess,
  GetEncaissementBienActionsError,
  TotalEncaissementParJourActionsSuccess,
  TotalEncaissementParJourActionsError,
  GetListImayerLocataireEncaissementPeriodeActionsSuccess,
  GetListImayerLocataireEncaissementPeriodeActionsError,
} from './reglement.actions';

@Injectable()
export class Encaissementffects {
  constructor(
    private apiService: ApiService,
    private effectActions: Actions,
    private notificationService: NotificationService
  ) {}
  saveEncaissementEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(EncaissementActionsTypes.SAVE_ENCAISSEMENT),
      mergeMap((action: EncaissementActions) => {
        return this.apiService
          .saveEncaissementAvecretourDeListe(action.payload)
          .pipe(
            map((quartier) => new SaveEncaissementActionsSuccess(quartier)),
            catchError((err) =>
              of(new SaveEncaissementActionsError(err.message))
            )
          );
      }),
      tap((resultat) => {
        if (
          resultat.type == EncaissementActionsTypes.SAVE_ENCAISSEMENT_SUCCES
        ) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Enregistrement éffectué avec succès !'
          );
        }
        if (
          resultat.type == EncaissementActionsTypes.SAVE_ENCAISSEMENT_ERROR
        )
        {
          this.sendErrorNotification(NotificationType.ERROR, resultat.payload);
        }
      })
    )
  );
  saveEncaissementGroupeEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(EncaissementActionsTypes.SAVE_ENCAISSEMENT_GROUPE),
      mergeMap((action: EncaissementActions) => {
        // console.log('**** payload encaissement groupe ****');
        // console.log(action.payload);
        return this.apiService
          .saveEncaissementMasseAvecretourDeListe(action.payload)
          .pipe(
            map((encaisse) => new SaveEncaissementGroupeActionsSuccess(encaisse)),
            catchError((err) =>
              of(new SaveEncaissementGroupeActionsError(err.message))
            )
          );
      }),
      tap((resultat) => {
        // if (
        //   resultat.type == EncaissementActionsTypes.SAVE_ENCAISSEMENT_GROUPE_SUCCES
        // ) {
        //   this.sendErrorNotification(
        //     NotificationType.SUCCESS,
        //     'Enregistrement éffectué avec succès !'
        //   );
        // }
        if (
          resultat.type == EncaissementActionsTypes.SAVE_ENCAISSEMENT_GROUPE_ERROR
        ){
          this.sendErrorNotification(NotificationType.ERROR, resultat.payload);
        }
      })
    )
  );
  totalEncaissementJournalierEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(EncaissementActionsTypes.TOTAL_ENCAISSEMENT_PAR_JOUR),
      mergeMap((action: EncaissementActions) => {
        return this.apiService.totalEncaissementParJour(action.payload).pipe(
          map((encaiss) => new TotalEncaissementParJourActionsSuccess(encaiss)),
          catchError((err) =>
            of(new TotalEncaissementParJourActionsError(err.message))
          )
        );
      })
    )
  );
  //SOMME ENCAISSEMENT PAR JOUR
  sommeEncaissementJournalierEffect: Observable<Action> = createEffect(() =>
  this.effectActions.pipe(
    ofType(EncaissementActionsTypes.SOMME_ENCAISSEMENT_ENTRE_DEUX_DATE),
    mergeMap((action: EncaissementActions) => {
      return this.apiService.sommeEncaissementParAgenceEtParPeriode(action.payload).pipe(
        map((encaiss) => new SommeEncaissementEntreDeuxDatesActionsSuccess(encaiss)),
        catchError((err) =>
          of(new SommeEncaissementEntreDeuxDatesActionsError(err.message))
        )
      );
    }),
    tap((resultat) => {
      if (
        resultat.type ==
        EncaissementActionsTypes.SOMME_ENCAISSEMENT_ENTRE_DEUX_DATE_ERROR
      ) {
        this.sendErrorNotification(
          NotificationType.ERROR,
          resultat.payload.toString()
        );
      }
    })
  )
);
sommeDueEntreDeuxDateEffect: Observable<Action> = createEffect(() =>
this.effectActions.pipe(
  ofType(EncaissementActionsTypes.SOMME_DUE_ENTRE_DEUX_DATE),
  mergeMap((action: EncaissementActions) => {
    return this.apiService.sommeLoyerParAgenceEtParPeriode(action.payload).pipe(
      map((encaiss) => new SommeDuentreDeuxDatesActionsSuccess(encaiss)),
      catchError((err) =>
        of(new SommeDueEntreDeuxDatesActionsError(err.message))
      )
    );
  }),
  tap((resultat) => {
    if (
      resultat.type ==
      EncaissementActionsTypes.SOMME_DUE_ENTRE_DEUX_DATE_ERROR
    ) {
      this.sendErrorNotification(
        NotificationType.ERROR,
        resultat.payload.toString()
      );
    }
  })
)
);
  //LISTE DES LOCATAIRES BAILS
  getAllLocatairesEncaissEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(EncaissementActionsTypes.GET_LOCATAIRE_ENCAISSEMENT),
      mergeMap((action: EncaissementActions) => {
        return this.apiService.bailByLocataireEtBien(action.payload).pipe(
          map(
            (locatires) => new GetLocataireEncaissementActionsSuccess(locatires)
          ),
          catchError((err) =>
            of(new GetLocataireEncaissementActionsError(err.message))
          )
        );
      }),
      tap((locataire) => {
        if (
          locataire.type ==
          EncaissementActionsTypes.GET_LOCATAIRE_ENCAISSEMENT_ERROR
        ) {
          this.sendErrorNotification(NotificationType.ERROR, locataire.payload);
        }
      })
    )
  );

  //LISTE DES LOCATAIRES IMPAYER
  getAllLocatairesImpayerEncaissEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(EncaissementActionsTypes.GET_LISTE_LOCATAIRE_ENCAISSEMENT),
      mergeMap((action: EncaissementActions) => {
        return this.apiService
          .listeLocataireImpayerParAgenceEtPeriode(action.payload)
          .pipe(
            map(
              (locatires) =>
                new GetListImayerLocataireEncaissementPeriodeActionsSuccess(
                  locatires
                )
            ),
            catchError((err) =>
              of(
                new GetListImayerLocataireEncaissementPeriodeActionsError(
                  err.message
                )
              )
            )
          );
      }),
      tap((locataire) => {
        if (
          locataire.type ==
          EncaissementActionsTypes.GET_LISTE_LOCATAIRE_ENCAISSEMENT_ERROR
        ) {
          this.sendErrorNotification(NotificationType.ERROR, locataire.payload);
        }
      })
    )
  );
  getAllPeriodebyBienEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(EncaissementActionsTypes.GET_ALL_PERIODE_REGLEMENT_BY_BIEN),
      mergeMap((action: OperationActions) => {
        return this.apiService.getFirstLoyerImpayerByBien(action.payload).pipe(
          map(
            (operations) =>
              new GetAllPeriodeReglementByBienActionsSuccess(operations)
          ),
          catchError((err) =>
            of(new GetAllPeriodeReglementByBienActionsError(err.message))
          )
        );
      }),
      tap((resultat) => {
        if (
          resultat.type ==
          EncaissementActionsTypes.GET_ALL_PERIODE_REGLEMENT_BY_BIEN_ERROR
        ) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            resultat.payload.toString()
          );
        }
      })
    )
  );
  getEncaissementbyBienEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(EncaissementActionsTypes.GET_ENCAISSEMENT_BY_BIEN),
      mergeMap((action: OperationActions) => {
        return this.apiService
          .findAllEncaissementByIdBienImmobilier(action.payload)
          .pipe(
            map(
              (operations) => new GetEncaissementBienActionsSuccess(operations)
            ),
            catchError((err) =>
              of(new GetEncaissementBienActionsError(err.message))
            )
          );
      }),
      tap((resultat) => {
        if (
          resultat.type ==
          EncaissementActionsTypes.GET_ENCAISSEMENT_BY_BIEN_ERROR
        ) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            resultat.payload.toString()
          );
        }
      })
    )
  );
  // LISTE DES ENCAISSEMENT ENTRE DEUX DATES
  totalEncaissementEntreDeuxDateEffect: Observable<Action> = createEffect(() =>
  this.effectActions.pipe(
    ofType(EncaissementActionsTypes.TOTAL_ENCAISSEMENT_ENTRE_DEUX_DATE),
    mergeMap((action: EncaissementActions) => {
      return this.apiService
        .listeEncaisseLoyerEntreDeuxDate(action.payload)
        .pipe(
          map((quartier) => new TotalEncaissementEntreDeuxDatesActionsSuccess(quartier)),
          catchError((err) =>
            of(new TotalEncaissementEntreDeuxDatesActionsError(err.message))
          )
        );
    }),
    tap((resultat) => {

      if (
        resultat.type == EncaissementActionsTypes.TOTAL_ENCAISSEMENT_ENTRE_DEUX_DATE_ERROR
      )
      {
        this.sendErrorNotification(NotificationType.ERROR, resultat.payload);
      }
    })
  )
);
listEncaissementEntreDeuxDatePourClotureEffect: Observable<Action> = createEffect(() =>
this.effectActions.pipe(
  ofType(EncaissementActionsTypes.GET_ENCAISSEMENT_CLOTURE),
  mergeMap((action: EncaissementActions) => {
    return this.apiService
      .listeEncaissementEntreDeuxDateParChapitreEtCaisse(action.payload)
      .pipe(
        map((encaiss) => new GetAllEncaissementClotureActionsSuccess(encaiss)),
        catchError((err) =>
          of(new GetAllEncaissementClotureActionsError(err.message))
        )
      );
  }),
  tap((resultat) => {

    if (
      resultat.type == EncaissementActionsTypes.TOTAL_ENCAISSEMENT_ENTRE_DEUX_DATE_ERROR
    )
    {
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
