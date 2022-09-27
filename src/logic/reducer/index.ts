import { combineReducers } from "redux";
import { routerReducer } from "./routerReducer";
import { bustpairReducer } from "./bustpairReducer";
import { wbnbReducer } from "./wbnbReducer";
import { bustfactoryReducer } from "./bustfactoryReducer";
import { ethReducer } from "./wallet.reducer";
import { slippageReducer } from "./slippage.reducer";
import { deadlineReducer } from "./deadline.reducer";
import { wbnbNewReducer } from "./wbnbNew.Reducer";

const rootReducer = combineReducers(
  {
    RouterBust : routerReducer,
    BustPair : bustpairReducer,
    REST : wbnbReducer,
    BUST : bustfactoryReducer,
    wallet : ethReducer,
    slippage: slippageReducer,
    deadline: deadlineReducer,
    WBNB : wbnbNewReducer,
  }
)

export default rootReducer;