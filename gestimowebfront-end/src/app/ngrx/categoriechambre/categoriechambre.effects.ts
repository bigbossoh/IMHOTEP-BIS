import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { mergeMap, map, catchError, tap } from "rxjs/operators";
import { ApiService } from "src/gs-api/src/services";

import { NotificationType } from "src/app/enum/natification-type.enum";
import { NotificationService } from "src/app/services/notification/notification.service";
import { CategorieChambreActions, CategorieChambreActionsTypes, ListChambreCategorieActionsError, ListChambreCategorieActionssSuccess, SaveChambreCategorieActionsError, SaveChambreCategorieActionssSuccess } from './categoriechambre.actions';

@Injectable()
export class CategorieChambreEffects {
  constructor(private apiService: ApiService, private effectActions: Actions, private notificationService: NotificationService) { }
  listCategorieChambre: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(CategorieChambreActionsTypes.LISTE_CATEGORIE_CHAMBRE),
      mergeMap((action: CategorieChambreActions) => {
        return this.apiService.findAllCategorieChambre(action.payload).pipe(
          map((cloturesCaisse) => new ListChambreCategorieActionssSuccess(cloturesCaisse)),
          catchError((err) => of(new ListChambreCategorieActionsError(err.message)))
        );
      }),
      tap((resultat) => {
        if (
          resultat.type ==
          CategorieChambreActionsTypes.LISTE_CATEGORIE_CHAMBRE_ERROR
        ) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            resultat.payload.toString()
          );
        }

      })
  ));

  saveCategorieChambre: Observable<Action> = createEffect(() =>
  this.effectActions.pipe(
    ofType(CategorieChambreActionsTypes.SAVE_CATEGORIE_CHAMBRE),
    mergeMap((action: CategorieChambreActions) => {
      return this.apiService.saveOrUpdateCategoryChambre(action.payload).pipe(
        map((cloturesCaisse) => new SaveChambreCategorieActionssSuccess(cloturesCaisse)),
        catchError((err) => of(new SaveChambreCategorieActionsError(err.message)))
      );
    }),
    tap((resultat) => {
      if (
        resultat.type ==
        CategorieChambreActionsTypes.SAVE_CATEGORIE_CHAMBRE_ERROR
      ) {
        this.sendErrorNotification(
          NotificationType.ERROR,
          resultat.payload.toString()
        );
      }
      if (
        resultat.type ==
        CategorieChambreActionsTypes.SAVE_CATEGORIE_CHAMBRE_SUCCES
      ) {
        this.sendErrorNotification(
          NotificationType.SUCCESS,
          "Enregistrement éffectué avec succès."
        );
      }
    })
));
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
