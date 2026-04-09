import { Action } from "@ngrx/store";

export enum StatistiqueChartActionType{
  GET_ALL_STATISTIQUE_PERIODE = 'Get All statistique periode',
  GET_ALL_STATISTIQUE_PERIODE_SUCCES = 'Get All statistique periode Succes',
  GET_ALL_STATISTIQUE_PERIODE_ERROR = 'Get All statistique periode Error',
}
export class GetAllStatistiquePeriodeAction implements Action {
  type: StatistiqueChartActionType = StatistiqueChartActionType.GET_ALL_STATISTIQUE_PERIODE;
  constructor(public payload: any) {}
}

export class GetAllStatistiquePeriodeActionSuccess implements Action {
  type: StatistiqueChartActionType = StatistiqueChartActionType.GET_ALL_STATISTIQUE_PERIODE_SUCCES;
  constructor(public payload: any) {}
}

export class GetAllStatistiquePeriodeActionError implements Action {
  type: StatistiqueChartActionType = StatistiqueChartActionType.GET_ALL_STATISTIQUE_PERIODE_ERROR;
  constructor(public payload: string) {}
}
export type StatistiqueChartAction=
GetAllStatistiquePeriodeAction|
GetAllStatistiquePeriodeActionSuccess|
GetAllStatistiquePeriodeActionError
