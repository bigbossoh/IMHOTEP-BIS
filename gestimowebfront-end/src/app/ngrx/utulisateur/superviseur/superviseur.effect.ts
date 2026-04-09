import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationService } from "src/app/services/notification/notification.service";
import { ApiService } from "src/gs-api/src/services";
import { Observable, of } from 'rxjs';
import { superviseurActionType, getAllSuperviseurActionSuccess, getAllSuperviseurActionError } from './superviseur.action';
import { map,mergeMap, catchError, tap } from 'rxjs/operators';
import { NotificationType } from "src/app/enum/natification-type.enum";
import { Action } from "@ngrx/store";

@Injectable()
export class SuperviseurEffects{
  constructor(private apiService: ApiService,
     private effectActions : Actions,
      private notificationService:NotificationService){}
  getAllSuperviseurEffect:Observable<Action>=createEffect(()=>
  this.effectActions.pipe(
    ofType(superviseurActionType.GET_ALL_SUPERVISEUR),
    mergeMap(()=>{
      return this.apiService.getAllSuperviseursByOrder().pipe(
        map((superviseur)=> new getAllSuperviseurActionSuccess(superviseur)),
        catchError((error)=> of(new getAllSuperviseurActionError(error.message))
        ),
      );
    }),
    tap((superviseur)=>{if(superviseur.payload.indexOf('Error') < 0){
      this.sendErrorNotification(NotificationType.SUCCESS,'La liste des superviseur a été chargées avec succès')
    }else{
      this.sendErrorNotification(NotificationType.ERROR,'Une erreur a été rencontré')
    }})

  ) );
  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

}
