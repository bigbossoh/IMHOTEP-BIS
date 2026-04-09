import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from 'src/gs-api/src/services';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import {
  SendMailActions,
  SendQuittanceByMailActionsType,
  SendQuittanceByMailActionsSuccess,
  SendQuittanceByMailActionsError,
} from './mail.action';
import { NotificationType } from '../../enum/natification-type.enum';
import { NotificationService } from '../../services/notification/notification.service';
import { SendQuittanceIndividuelActionsSuccess, SendQuittanceIndividuelActionsError } from './mail.action';

@Injectable()
export class MailEffect {
  constructor(
    private apiService: ApiService,
    private effectActions: Actions,
    private notificationService: NotificationService
  ) {}
  //SEND MAIL GROUPEE
  sendMailGrouperEffect: Observable<Action> = createEffect(() =>
    this.effectActions.pipe(
      ofType(SendQuittanceByMailActionsType.SEND_QUITTANCE_GROUPER_BY_MAIL),
      mergeMap((action: SendMailActions) => {
        return this.apiService
          .sendMailGrouperWithAttachment(action.payload)
          .pipe(
            map((mails) => new SendQuittanceByMailActionsSuccess(mails)),
            catchError((err) =>
              of(new SendQuittanceByMailActionsError(err.message))
            )
          );
      }),
      tap((resultat) => {
        if (resultat.payload == true) {
          this.sendErrorNotification(
            NotificationType.SUCCESS,
            'Mail envoyé avec succès !'
          );
        } else {
          this.sendErrorNotification(
            NotificationType.ERROR,
            'Certains mail ne sont pas envoyé'
          );
        }
      })
    )
  );

   // SEND MAIL INDIVIDUEL
   sendMailIndividuelEffect: Observable<Action> = createEffect(() =>
   this.effectActions.pipe(
     ofType(SendQuittanceByMailActionsType.SEND_QUITTANCE_INDIVIDUEL),
     mergeMap((action: SendMailActions) => {
       return this.apiService
         .sendMailQuittanceWithAttachment(action.payload)
         .pipe(
           map((mails) => new SendQuittanceIndividuelActionsSuccess(mails)),
           catchError((err) =>
             of(new SendQuittanceIndividuelActionsError(err.message))
           )
         );
     }),
     tap((resultat) => {
       if (resultat.payload == true) {
         this.sendErrorNotification(
           NotificationType.SUCCESS,
           'Mail envoyé avec succès !'
         );
       } else {
         this.sendErrorNotification(
           NotificationType.ERROR,
           'Certains mail ne sont pas envoyé'
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
