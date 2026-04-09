import { Action } from '@ngrx/store';
import { StatistiqueChartAction, StatistiqueChartActionType } from './statistiquechart.action';
export enum StatistiqueChartStateEnum{
  INITIAL='Initial',
  LOADING='Loading',
  LOADED='Loaded',
  ERROR='Error'
}
export interface StatistiqueChartState{
  datachart: any;
  errorMessage:string;
  dataState:StatistiqueChartStateEnum
}

const initState: StatistiqueChartState={
  datachart:[],
  errorMessage:'',
  dataState:StatistiqueChartStateEnum.INITIAL
}

export function StatistiqueChartReducer( state: StatistiqueChartState=initState,
  action: Action):StatistiqueChartState{
    switch(action.type){
      case StatistiqueChartActionType.GET_ALL_STATISTIQUE_PERIODE:
        return { ...state, dataState: StatistiqueChartStateEnum.LOADING };
      case StatistiqueChartActionType.GET_ALL_STATISTIQUE_PERIODE_SUCCES:
        return {
          ...state,
          dataState: StatistiqueChartStateEnum.LOADED,
          datachart: (<StatistiqueChartAction>action).payload
        };
        case StatistiqueChartActionType.GET_ALL_STATISTIQUE_PERIODE_ERROR:
      return {
        ...state,
        dataState: StatistiqueChartStateEnum.ERROR,
        errorMessage: (<StatistiqueChartAction>action).payload,
      };
    default:
      return { ...state };
    }

}
