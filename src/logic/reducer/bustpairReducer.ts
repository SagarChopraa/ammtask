import { SET_BUSTPAIR_ABI} from "../action/actiontype";

const initialState={};

export const bustpairReducer = (state = initialState, action:any) => {
    const {type, payload} = action;
    switch(type){
      case SET_BUSTPAIR_ABI:
        return{
          ...state,
          ...payload
        }
        default:
          return state;
    }
}