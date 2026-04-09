import { Action } from '@ngrx/store';
import { ImagesActions, ImagesActionsTypes } from './images.action';

export enum ImagesStateEnum {
  LOADING = 'Loading',
  LOADED = 'Loaded',
  ERROR = 'Error',
}
export interface ImagesState {
  logo: any;
  leLog: Blob;
  errorMessage: string;
  dataState: ImagesStateEnum;
}
const initState: ImagesState = {
  logo: null,
  leLog:new Blob,
  errorMessage: '',
  dataState: ImagesStateEnum.LOADING,
};
export function imageReducer(
  state: ImagesState = initState,
  action: Action
): ImagesState {
  switch (action.type) {
    //GET ALL ETAGES
    case ImagesActionsTypes.UPLOAD_LOGO:
      return { ...state, dataState: ImagesStateEnum.LOADING };
    case ImagesActionsTypes.UPLOAD_LOGO_SUCCES:
      console.log("le vrai payload est le suivant : ");
      console.log( (<ImagesActions>action).payload);


      return {
        ...state,
        dataState: ImagesStateEnum.LOADED,
        leLog: (<ImagesActions>action).payload,
      };
    case ImagesActionsTypes.UPLOAD_LOGO_ERROR:

      return {
        ...state,
        dataState: ImagesStateEnum.ERROR,
        errorMessage: (<ImagesActions>action).payload,
      };
    //GET LOGO
     //GET ALL ETAGES
     case ImagesActionsTypes.GET_LOGO:
      return { ...state, dataState: ImagesStateEnum.LOADING };
    case ImagesActionsTypes.GET_LOGO_SUCCES:
      return {
        ...state,
        dataState: ImagesStateEnum.LOADED,
        logo: (<ImagesActions>action).payload,
      };
    case ImagesActionsTypes.GET_LOGO_ERROR:
      return {
        ...state,
        dataState: ImagesStateEnum.ERROR,
        errorMessage: (<ImagesActions>action).payload,
      };
    default:
      return { ...state };
  }
}
