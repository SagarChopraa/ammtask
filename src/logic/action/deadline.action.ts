import { DECREMENT_DEADLINE, INCREMENT_DEADLINE } from "./actiontype";

export const incrementDeadline = () => {
	return {
		type: INCREMENT_DEADLINE,
		// payload: data,
	};
};
export const decrementDeadline = () => {
	return {
		type: DECREMENT_DEADLINE,
        // payload: data,
	};
};
