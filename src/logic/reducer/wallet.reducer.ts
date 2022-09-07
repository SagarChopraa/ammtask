import { CONNECT_ETH_WALLET, DISCONNECT_ETH_WALLET } from '../../logic/action/actiontype'

const initialState = {
  ethWalletConnected: false,
  address: "",
}

export const ethReducer = (state = initialState, action: any) => {
  const { type, payload } = action
  switch (type) {
    case CONNECT_ETH_WALLET:
      return {
        ...state,
        ethWalletConnected: true,
        address: payload,
      }
    case DISCONNECT_ETH_WALLET:
      return {
        ...state,
        ethWalletConnected: false,
        address: "",
      }
    default:
      return state
  }
}
