import { DECREMENT_SLIPPAGE, INCREMENT_SLIPPAGE } from "./actiontype";

export const incrementSlippage = () => {
	return {
		type: INCREMENT_SLIPPAGE,
		// payload: data,
	};
};
export const decrementSlippage = () => {
	return {
		type: DECREMENT_SLIPPAGE,
        // payload: data,
	};
};
