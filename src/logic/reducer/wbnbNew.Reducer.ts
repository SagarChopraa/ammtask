import { SET_WBNB } from "../action/actiontype";

const initialState={};

export const wbnbNewReducer = (state = initialState, action:any) => {
    const {type, payload} = action;
    switch(type){
      case SET_WBNB:
        return{
          ...state,
          ...payload
        }
        default:
          return state;
    }
}