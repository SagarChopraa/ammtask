import { SET_WBNB } from "./actiontype";

export const setwbnb = (data:any) => {
  return{
    type: SET_WBNB,
    payload: data
  }
}