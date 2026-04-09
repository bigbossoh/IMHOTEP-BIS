import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { mergeMap, map, catchError, tap } from "rxjs/operators";
import { ApiService } from "src/gs-api/src/services";

import { NotificationType } from "src/app/enum/natification-type.enum";
import { NotificationService } from "src/app/services/notification/notification.service";
import { ListPrixChambreParCategorieActions, ListPrixChambreParCategorieActionsError, ListPrixChambreParCategorieActionsSuccess, PrixParCategorieChambreActions, PrixParCategorieChambreActionsTypes, SavePrixChambreParCategorieActionsError, SavePrixChambreParCategorieActionsSuccess } from './prix-par-categorie-chambre.action';

@Injectable()
export class PrixParCategorieChambreEffects {
  constructor(private apiService: ApiService, private effectActions: Actions, private notificationService: NotificationService) { }
  listPrixCategorieChambre: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(PrixParCategorieChambreActionsTypes.LISTE_PRIX_PAR_CATEGORIE_CHAMBRE),
      mergeMap((action: PrixParCategorieChambreActions) => {

        return this.apiService.listDesPrixParCategori(action.payload).pipe(
          map((prixCat) => new ListPrixChambreParCategorieActionsSuccess(prixCat)),
          catchError((err) => of(new ListPrixChambreParCategorieActionsError(err.message)))
        );
      }),
      tap((resultat) => {
        if (
          resultat.type ==
          PrixParCategorieChambreActionsTypes.LISTE_PRIX_PAR_CATEGORIE_CHAMBRE_ERROR
        ) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            resultat.payload.toString()
          );
        }

      })
  ));
  savePrixCategorieChambre: Observable<Action> = createEffect(() =>
  this.effectActions.pipe(
    ofType(PrixParCategorieChambreActionsTypes.SAVE_PRIX_PAR_CATEGORIE_CHAMBRE),
    mergeMap((action: PrixParCategorieChambreActions) => {

      return this.apiService.saveOrUpDatePrixParCategorie(action.payload).pipe(
        map((prixCat) => new SavePrixChambreParCategorieActionsSuccess(prixCat)),
        catchError((err) => of(new SavePrixChambreParCategorieActionsError(err.message)))
      );
    }),
    tap((resultat) => {
      if (
        resultat.type ==
        PrixParCategorieChambreActionsTypes.SAVE_PRIX_PAR_CATEGORIE_CHAMBRE_ERROR
      ) {
        this.sendErrorNotification(
          NotificationType.ERROR,
          resultat.payload.toString()
        );
      }
      if (
        resultat.type ==
        PrixParCategorieChambreActionsTypes.SAVE_PRIX_PAR_CATEGORIE_CHAMBRE_SUCCES
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
