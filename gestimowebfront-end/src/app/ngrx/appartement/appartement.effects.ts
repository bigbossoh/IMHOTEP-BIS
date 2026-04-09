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
import {
  GetAllAppartementActionsSuccess,
  GetAllAppartementActionsError,
  GetAppartementByIdActionsSuccess,
  GetAppartementByIdActionsError,
  GetAllAppartementMeubleActionsSuccess,
  GetAllAppartementMeubleActionsError,
  GetAllAppartementMeubleParCategorieActionsSuccess,
  GetAllAppartementMeubleParCategorieActionsError,
  SaveAppartementCatActionsSuccess,
  SaveAppartementCatActionsError,
} from './appartement.actions';
import {
  AppartementActions,
  AppartementctionsTypes as AppartementActionsTypes,
  GetAllAppartementLibreActionsError,
  GetAllAppartementLibreActionsSuccess,
  SaveAppartementActionsError,
  SaveAppartementActionsSuccess,
} from './appartement.actions';

@Injectable()
export class AppartementEffects {

  constructor(
    private apiService: ApiService,
    private effectActions: Actions,

    private notificationService: NotificationService
  ) {

  }

  //SAVE EFFECTS
  saveAppartementEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppartementActionsTypes.SAVE_APPARTEMENT),
      mergeMap((action: AppartementActions) => {
        return this.apiService.saveAppartement(action.payload).pipe(
          map((appart) => new SaveAppartementActionsSuccess(appart)),
          catchError((err) => of(new SaveAppartementActionsError(err.message)))
        );
      }),
      tap((resultat) => {
        if (resultat.type == AppartementActionsTypes.SAVE_APPARTEMENT_SUCCES) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            "L'opération effectuée avec succès"
          );
        } else {
          this.sendErrorNotification(
            NotificationType.ERROR,
            resultat.payload.toString()
          );
        }
      })
    )
  );
  //GET APPARTEMENT BY  EFFECTS
  getAppartementByIdEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppartementActionsTypes.GET_APPARTEMENT_BY_ID),
      mergeMap((action: AppartementActions) => {
        return this.apiService.findByIDAppartement(action.payload).pipe(
          map((appart) => new GetAppartementByIdActionsSuccess(appart)),
          catchError((err) =>
            of(new GetAppartementByIdActionsError(err.message))
          )
        );
      }),
      tap((resultat) => {
        console.log('Le appartement qui est a modifier est le suivant :');
        console.log(resultat.payload);

        if (
          resultat.type == AppartementActionsTypes.GET_APPARTEMENT_BY_ID_SUCCES
        ) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            "L'opération effectuée avec succès"
          );
        } else {
          this.sendErrorNotification(
            NotificationType.ERROR,
            resultat.payload.toString()
          );
        }
      })
    )
  );
  //LISTE DES APPARTEMENT LIBRE
  getAllAppartementLibreEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(


      ofType(AppartementActionsTypes.GET_ALL_APPARTEMENT_LIBRE),
      mergeMap((actions: AppartementActions) => {

        return this.apiService.findAllAppartementLibre(actions.payload).pipe(
          map(
            (appartement) =>
              new GetAllAppartementLibreActionsSuccess(appartement)
          ),
          catchError((err) =>
            of(new GetAllAppartementLibreActionsError(err.message))
          )
        );
      })
    )
  );
  //LISTE DES APPARTEMENT
  getAllAppartementEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppartementActionsTypes.GET_ALL_APPARTEMENT),
      mergeMap((actions:AppartementActions) => {
        return this.apiService.findAllAppartement(actions.payload).pipe(
          map(
            (appartement) => new GetAllAppartementActionsSuccess(appartement)
          ),
          catchError((err) =>
            of(new GetAllAppartementActionsError(err.message))
          )
        );
      }),
      tap((resultat) => {
        if (resultat.type == AppartementActionsTypes.GET_ALL_APPARTEMENT_ERROR) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            resultat.payload.toString()
          );
        }
      })
    )
  );

  //LISTE DES APPARTEMENT
  getAllAppartementMeubleEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(AppartementActionsTypes.GET_ALL_APPARTEMENT_MEUBLE),
      mergeMap((actions:AppartementActions) => {
        return this.apiService.findAllAppartementMeuble(actions.payload).pipe(
          map(
            (appartement) => new GetAllAppartementMeubleActionsSuccess(appartement)
          ),
          catchError((err) =>
            of(new GetAllAppartementMeubleActionsError(err.message))
          )
        );
      }),
      tap((resultat) => {
        if (resultat.type == AppartementActionsTypes.GET_ALL_APPARTEMENT_MEUBLE_ERROR) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            resultat.payload.toString()
          );
        }
      })
    )
  );
  getAllAppartementMeubleCategorieEffect: Observable<Action> = createEffect(() =>
  this.effectActions.pipe(
    ofType(AppartementActionsTypes.GET_ALL_APPARTEMENT_MEUBLE_PAR_CATEGORIE),
    mergeMap((actions:AppartementActions) => {
      return this.apiService.findAllAppartementByIdCategorie(actions.payload).pipe(
        map(
          (appartement) => new GetAllAppartementMeubleParCategorieActionsSuccess(appartement)
        ),
        catchError((err) =>
          of(new GetAllAppartementMeubleParCategorieActionsError(err.message))
        )
      );
    }),
    tap((resultat) => {
      if (resultat.type == AppartementActionsTypes.GET_ALL_APPARTEMENT_MEUBLE_PAR_CATEGORIE_ERROR) {
        this.sendErrorNotification(
          NotificationType.ERROR,
          resultat.payload.toString()
        );
      }
    })
  )
);

 //SAVE EFFECTS
 saveAppartementCateEffect: Observable<Action> = createEffect(() =>
 this.effectActions.pipe(
   ofType(AppartementActionsTypes.SAVE_APPARTEMENT_CATE),
   mergeMap((action: AppartementActions) => {
     return this.apiService.saveForCategorie(action.payload).pipe(
       map((appart) => new SaveAppartementCatActionsSuccess(appart)),
       catchError((err) => of(new SaveAppartementCatActionsError(err.message)))
     );
   }),
   tap((resultat) => {
     if (resultat.type == AppartementActionsTypes.SAVE_APPARTEMENT_CATE_SUCCES) {
       this.sendErrorNotification(
         NotificationType.SUCCESS,
         "L'opération effectuée avec succès"
       );
     }
     if (resultat.type == AppartementActionsTypes.SAVE_APPARTEMENT_CATE_ERROR) {
       this.sendErrorNotification(
         NotificationType.ERROR,
         resultat.payload.toString()
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
