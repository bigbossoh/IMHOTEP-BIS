import { PrintServiceService } from './../../services/Print/print-service.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/gs-api/src/services';
import { NotificationType } from '../../enum/natification-type.enum';
import { NotificationService } from '../../services/notification/notification.service';
import { ImagesActions, ImagesActionsTypes, UploadLogoAcionsSuccess, UploadLogoAcionsError, GetLogoAcionsSuccess, GetLogoAcionsError } from './images.action';

@Injectable()
export class ImageEffects {
  constructor(
    private apiService: ApiService,
    private printApiService: PrintServiceService,
    private effectActions: Actions,
    private notificationService: NotificationService
  ) {}


  //SAVE LOGO
  // uploadLogoEffect: Observable<Action> = createEffect(() =>
  //   this.effectActions.pipe(
  //     ofType(ImagesActionsTypes.UPLOAD_LOGO),
  //     mergeMap((actions: ImagesActions) => {
  //       console.log("Le payload est ");
  //       console.log(actions.payload);
  //       return this.printApiService.savelogo(actions.payload).pipe(
  //         map((logo) => new UploadLogoAcionsSuccess(logo)),
  //         catchError((err) =>
  //           of(new UploadLogoAcionsError(err.message))
  //         )
  //       );
  //     }),
  //     tap((resultat) => {
  //       if (resultat.type == ImagesActionsTypes.UPLOAD_LOGO_ERROR) {
  //         this.sendErrorNotification(
  //           NotificationType.ERROR,
  //           resultat.payload.toString()
  //         );
  //       }
  //     })
  //   )
  // );
//GET LOGO
// getLogoEffect: Observable<Action> = createEffect(() =>
// this.effectActions.pipe(
//   ofType(ImagesActionsTypes.GET_LOGO),
//   mergeMap((actions: ImagesActions) => {
//     console.log("Le payload est ");
//     console.log(actions.payload);
//     return this.apiService.getlogo(actions.payload).pipe(
//       map((logo) => new GetLogoAcionsSuccess(logo)),
//       catchError((err) =>
//         of(new GetLogoAcionsError(err.message))
//       )
//     );
//   }),
//   tap((resultat) => {
//     if (resultat.type == ImagesActionsTypes.UPLOAD_LOGO_ERROR) {
//       this.sendErrorNotification(
//         NotificationType.ERROR,
//         resultat.payload.toString()
//       );
//     }
//   })
// )
// );
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
