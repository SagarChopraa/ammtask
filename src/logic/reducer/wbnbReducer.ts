import { SET_WBNB_ABI } from "../action/actiontype";

const initialState={};

export const wbnbReducer = (state = initialState, action:any) => {
    const {type, payload} = action;
    switch(type){
      case SET_WBNB_ABI:
        return{
          ...state,
          ...payload
        }
        default:
          return state;
    }
}