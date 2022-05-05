import { RATypes, ReduxAction } from "@redux/actions";
import initialState, { RSTButton } from "@redux/initialState";

type ButtonReducer = (state: RSTButton | undefined, action: ReduxAction) => RSTButton;
const buttonReducer: ButtonReducer = function(state = initialState.buttons, action) {
	const newState = Object.assign({}, state);
	if (action.type === RATypes.BUTTON_SET_STATE) {
		const { buttonId, loading } = action.payload;
		newState[buttonId] = {
			...(newState[buttonId] || {}),
			loading
		};
		return newState;
	}
	if (action.type === RATypes.BUTTON_CLEAR_STATE) {
		const { buttonId } = action.payload;
		delete newState[buttonId];
		return newState;
	}
	return state;
};

export default buttonReducer;
