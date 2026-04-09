import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { mergeMap, map, catchError, tap } from "rxjs/operators";
import { NotificationService } from "src/app/services/notification/notification.service";
import { ApiService } from "src/gs-api/src/services";
import { EtagesActionsTypes, EtagesActions, GetAllEtagesByImmeubleActionsSuccess, GetAllEtagesByImmeubleActionsError } from "../etage/etage.actions";
import { EtablissementActionsTypes, EtablissementsActions, GetDefaultEtabNameActionsError, GetDefaultEtabNameActionsSuccess } from "./etablisement.action";
import { NotificationType } from 'src/app/enum/natification-type.enum';

@Injectable()
export class EtablissementEffects {

  constructor(private apiService: ApiService,
    private effectActions: Actions
    , private notificationService: NotificationService) {

  }

  //GET ALL ETAGE PAR IMMEUBLE
  getDefaultName: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(EtablissementActionsTypes.GET_ETAB_DEFAULT_NAME),
      mergeMap((action: EtablissementsActions) => {
        return this.apiService.getDefaultEtable(action.payload).pipe(
          map((immeubles) => new GetDefaultEtabNameActionsSuccess(immeubles)),
          catchError((err) =>
            of(new GetDefaultEtabNameActionsError(this.extractErrorMessage(err)))
          )
        );
      }),
      tap((resultat) => {
        if (
          resultat.type ==
          EtablissementActionsTypes.GET_ETAB_DEFAULT_NAME_ERROR
        ) {
          this.sendErrorNotification(
            NotificationType.ERROR,
            this.extractErrorMessage(resultat.payload)
          );
        }
      })

    )
  );
  private extractErrorMessage(error: any): string {
    if (typeof error === 'string' && error.trim().length > 0) {
      return error;
    }

    if (Array.isArray(error)) {
      return error.filter(Boolean).join(', ');
    }

    if (typeof error?.error === 'string' && error.error.trim().length > 0) {
      return error.error;
    }

    if (Array.isArray(error?.error?.errors)) {
      return error.error.errors.filter(Boolean).join(', ');
    }

    if (typeof error?.error?.message === 'string' && error.error.message.trim().length > 0) {
      return error.error.message;
    }

    if (typeof error?.message === 'string' && error.message.trim().length > 0) {
      return error.message;
    }

    return "Impossible de charger l'etablissement par defaut.";
  }

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
