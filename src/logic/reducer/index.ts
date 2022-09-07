import { combineReducers } from "redux";
import { routerReducer } from "./routerReducer";
import { bustpairReducer } from "./bustpairReducer";
import { wbnbReducer } from "./wbnbReducer";
import { bustfactoryReducer } from "./bustfactoryReducer";
import { ethReducer } from "./wallet.reducer";

const rootReducer = combineReducers(
  {
    RouterBust : routerReducer,
    BustPair : bustpairReducer,
    BUSD : wbnbReducer,
    BUST : bustfactoryReducer,
    wallet : ethReducer
  }
)

export default rootReducer;