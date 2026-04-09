import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/gs-api/src/services';
import {
  SiteActions,
  CreateNewSiteActionSuccess,
  CreateNewSiteActionError,
  DeleteSiteActionSuccess,
  DeleteSiteActionError,
} from './site.actions';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationType } from '../../enum/natification-type.enum';
import {
  SiteActionsTypes,
  GetAllSitesActionsError,
  GetAllSitesActionsSuccess,
} from './site.actions';

@Injectable()
export class SiteEffects {

  constructor(
    private apiService: ApiService,
    private effectActions: Actions,
    private notificationService: NotificationService
  ) {

  }
  getAllSitesEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(SiteActionsTypes.GET_ALL_SITES),
      mergeMap((actions: SiteActions) => {
        console.log("Le sites le suivant suivant est");
        console.log(actions.payload);
        if (actions.payload!=undefined) {
          return this.apiService.findAllSites(actions.payload).pipe(
            map((sites) => new GetAllSitesActionsSuccess(sites)),
            catchError((err) => of(new GetAllSitesActionsError(err.message)))
          );
        } else {
          return this.apiService.findAllSites(0).pipe(
            map((sites) => new GetAllSitesActionsSuccess(sites)),
            catchError((err) => of(new GetAllSitesActionsError(err.message)))
          );
        }


      }),
      tap((bookCollection) => {
        if (bookCollection.type == SiteActionsTypes.GET_ALL_SITES_SUCCES) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Téléchargement des sites éffectués avec succes!'
          );
        } else  if (bookCollection.type == SiteActionsTypes.GET_ALL_SITES_ERROR) {
          this.sendErrorNotification(NotificationType.ERROR, bookCollection.payload.toString());
        }
      })
    )
  );
  createNewSiteEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(SiteActionsTypes.CREATE_NEW_SITE),
      mergeMap((action: SiteActions) => {
        return this.apiService.saveSite(action.payload).pipe(
          map((sites) => new CreateNewSiteActionSuccess(sites)),
          catchError((err) => of(new CreateNewSiteActionError(err.message)))
        );
      }),
      tap((bookCollection) => {
        if (bookCollection.type == SiteActionsTypes.CREATE_NEW_SITE_SUCCES) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Création du site éffectué avec succes!'
          );
        } else  if (bookCollection.type == SiteActionsTypes.GET_ALL_SITES_ERROR) {
          this.sendErrorNotification(NotificationType.ERROR, bookCollection.payload.toString());
        }
      })
    )
  );
  // DELETE EFFECTS
  deleteSiteEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(SiteActionsTypes.DELETE_SITE),
      mergeMap((action: SiteActions) => {
        return this.apiService.deleteSite(action.payload).pipe(
          map((sites) => new DeleteSiteActionSuccess(sites)),
          catchError((err) => of(new DeleteSiteActionError(err.message)))
        );
      }),
      tap((bookCollection) => {
        if (bookCollection.payload == true) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Supression du site éffectué avec succes!'
          );
        } else {
          this.sendErrorNotification(NotificationType.ERROR, '');
        }
      })
    )
  );
  //MESSAGE NOTIFICATION
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
