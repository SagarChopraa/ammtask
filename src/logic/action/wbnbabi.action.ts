import { SET_WBNB_ABI } from "./actiontype";

export const setwbnbabi = (data:any) => {
  return{
    type: SET_WBNB_ABI,
    payload: data
  }
}