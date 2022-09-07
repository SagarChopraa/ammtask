import { SET_ROUTER_ABI } from "../action/actiontype";

const initialState={};

export const routerReducer = (state = initialState, action:any) => {
    const {type, payload} = action;
    switch(type){
      case SET_ROUTER_ABI:
        return{
          ...state,
          ...payload
        }
        default:
          return state;
    }
}