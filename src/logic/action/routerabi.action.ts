import { SET_ROUTER_ABI } from "./actiontype";

export const setrouterabi = (data:any) => {
  return{
    type: SET_ROUTER_ABI,
    payload: data
  }
}