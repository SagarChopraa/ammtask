import { SET_BUSTFACTORY_ABI } from "./actiontype";

export const setBustFactoryabi = (data:any) => {
  return{
    type: SET_BUSTFACTORY_ABI,
    payload: data
  }
}