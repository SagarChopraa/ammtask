import { CONNECT_ETH_WALLET, DISCONNECT_ETH_WALLET } from "./actiontype";

export const connectEthWallet = (data: any) => {
	return {
		type: CONNECT_ETH_WALLET,
		payload: data,
	};
};
export const disconnectEthWallet = () => {
	return {
		type: DISCONNECT_ETH_WALLET,
	};
};
