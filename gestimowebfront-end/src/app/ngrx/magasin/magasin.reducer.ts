import { Action } from '@ngrx/store';
import {
  MagasinDto,
} from 'src/gs-api/src/models';
import { MagasinActions, MagasinActionsTypes } from './magasin.actions';
import { MagasinResponseDto } from '../../../gs-api/src/models/magasin-response-dto';
export enum MagasinStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
  INITIAL = 'Initial',
  NEW = 'New',
  EDIT = 'Edit',
}
export interface MagasinState {
  magasins: MagasinResponseDto[];
  magasin: any;
  errorMessage: string;
  dataState: MagasinStateEnum;
}
const initState: MagasinState = {
  magasins: [],
  magasin:null,
  errorMessage: '',
  dataState: MagasinStateEnum.INITIAL,
};
export function magasinReducer(
  state: MagasinState = initState,
  action: Action
): MagasinState {
  switch (action.type) {
    //SAVE MAGASIN
    case MagasinActionsTypes.SAVE_MAGASIN:
      return { ...state, dataState: MagasinStateEnum.LOADING };
    case MagasinActionsTypes.SAVE_MAGASIN_SUCCES:
      let leMagasin = (<MagasinActions>action).payload;

      if (leMagasin.id != 0 || leMagasin.id != null) {
        let modifMagasins = [...state.magasins]
        let magasinId=0;
       for (let index = 0; index < modifMagasins.length; index++) {
       if (modifMagasins[index].id==leMagasin.id) {
         modifMagasins[index] = leMagasin;
         return {
          ...state,
          dataState: MagasinStateEnum.LOADED,
          magasins: modifMagasins,
        };
       }

       }

        let magasinToModif=state.magasins.find(maga=>{maga.id==(<MagasinActions>action).payload.id})
        console.log("L'index is this :");
        console.log(magasinId);
        console.log("The payload magasin is : ");
        console.log(leMagasin);

        modifMagasins[magasinId] = (<MagasinActions>action).payload;
        console.log("The new state est le suivant");
        console.log(modifMagasins);
        return {
          ...state,
          dataState: MagasinStateEnum.LOADED,
          magasins: modifMagasins,
        };

      } else {
        let maga: MagasinDto[] = [...state.magasins];
        maga.push((<MagasinActions>action).payload);
        return {
          ...state,
          dataState: MagasinStateEnum.LOADED,
          magasins: maga,
        };
      }

    case MagasinActionsTypes.SAVE_MAGASIN_ERROR:
      return {
        ...state,
        dataState: MagasinStateEnum.ERROR,
        errorMessage: (<MagasinActions>action).payload,
      };

    // GET ALL MAGASINS LIBRES
    case MagasinActionsTypes.GET_ALL_MAGASIN_LIBRE:
      return { ...state, dataState: MagasinStateEnum.LOADING };
    case MagasinActionsTypes.GET_ALL_MAGASIN_LIBRE_SUCCES:
      return {
        ...state,
        dataState: MagasinStateEnum.LOADED,
        magasins: (<MagasinActions>action).payload,
      };
    case MagasinActionsTypes.GET_ALL_MAGASIN_LIBRE_ERROR:
      return {
        ...state,
        dataState: MagasinStateEnum.ERROR,
        errorMessage: (<MagasinActions>action).payload,
      };

     // GET MAGASIN BY ID
     case MagasinActionsTypes.GET_MAGASIN_BY_ID:
      return { ...state, dataState: MagasinStateEnum.LOADING };
    case MagasinActionsTypes.GET_MAGASIN_BY_ID_SUCCES:
      return {
        ...state,
        dataState: MagasinStateEnum.LOADED,
        magasin: (<MagasinActions>action).payload,
      };
    case MagasinActionsTypes.GET_MAGASIN_BY_ID_ERROR:
      return {
        ...state,
        dataState: MagasinStateEnum.ERROR,
        errorMessage: (<MagasinActions>action).payload,
      };
      // GET ALL MAGASINS
      case MagasinActionsTypes.GET_ALL_MAGASIN:
        return { ...state, dataState: MagasinStateEnum.LOADING };
      case MagasinActionsTypes.GET_ALL_MAGASIN_SUCCES:
        return {
          ...state,
          dataState: MagasinStateEnum.LOADED,
          magasins: (<MagasinActions>action).payload,
        };
      case MagasinActionsTypes.GET_ALL_MAGASIN_ERROR:
        return {
          ...state,
          dataState: MagasinStateEnum.ERROR,
          errorMessage: (<MagasinActions>action).payload,
        };
    default:
      return { ...state };
  }
}
