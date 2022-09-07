import { SET_BUSTFACTORY_ABI} from "../action/actiontype";

const initialState={};

export const bustfactoryReducer = (state = initialState, action:any) => {
    const {type, payload} = action;
    switch(type){
      case SET_BUSTFACTORY_ABI:
        return{
          ...state,
          ...payload
        }
        default:
          return state;
    }
}