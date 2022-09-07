import { SET_BUSTPAIR_ABI } from "./actiontype";

export const setBustPairabi = (data:any) => {
  return{
    type: SET_BUSTPAIR_ABI,
    payload: data
  }
}