import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { NotificationService } from "src/app/services/notification/notification.service";
import { ApiService } from "src/gs-api/src/services";
import { GetAllStatistiquePeriodeActionError, GetAllStatistiquePeriodeActionSuccess, StatistiqueChartAction, StatistiqueChartActionType } from "./statistiquechart.action";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { NotificationType } from "src/app/enum/natification-type.enum";

@Injectable()
export class StatistiqueChartEffect{
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
  constructor(
    private apiService: ApiService,
    private effectActions: Actions,
    private notificationService: NotificationService
  ) {}
  gestAllDataStatistiqueChartEffect:Observable<Action> = createEffect(()=>
  this.effectActions.pipe(
    ofType(StatistiqueChartActionType.GET_ALL_STATISTIQUE_PERIODE),
    mergeMap((act:StatistiqueChartAction)=>{
      return this.apiService.getTotalEncaissementsEtMontantsDeLoyerParMois(act.payload).pipe(
        map((result)=>new GetAllStatistiquePeriodeActionSuccess(result)),
        catchError((err) => of(new GetAllStatistiquePeriodeActionError(err.message)))
      )
    }),tap((resulttap)=>{
      if(resulttap.type==StatistiqueChartActionType.GET_ALL_STATISTIQUE_PERIODE_SUCCES){
        this.sendErrorNotification(
          NotificationType.SUCCESS,
          "les valeurs de statistique ont été charge avec succès"
        );
      }
        if(resulttap.type==StatistiqueChartActionType.GET_ALL_STATISTIQUE_PERIODE_ERROR){
          this.sendErrorNotification(
            NotificationType.ERROR,
            resulttap.payload
          );

      }
    }
  )
  )

  )
}
