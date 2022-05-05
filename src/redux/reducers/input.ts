import { RATypes, ReduxAction } from "@redux/actions";
import initialState, { RSTInput, RSInput, InputValidity } from "@redux/initialState";

type InputReducer = (state: RSTInput | undefined, action: ReduxAction) => RSTInput;
const inputReducer: InputReducer = function(state = initialState.input, action) {
	const newState = Object.assign({}, state);
	if (action.type === RATypes.INPUT_INVALID) {
		const { inputId, pageId, errorText } = action.payload;
		const key = pageId + "@" + inputId;
		newState[key] = {
			...(newState[key] || {}),
			validity: InputValidity.INVALID,
			errorText
		};
		return newState;
	}
	if (action.type === RATypes.INPUT_VALID) {
		const { inputId, pageId } = action.payload;
		const key = pageId + "@" + inputId;
		newState[key] = {
			...(newState[key] || {}),
			validity: InputValidity.VALID,
			errorText: undefined
		};
		return newState;
	}
	if (action.type === RATypes.INPUT_UNSURE) {
		const { inputId, pageId } = action.payload;
		const key = pageId + "@" + inputId;
		newState[key] = {
			...(newState[key] || {}),
			errorText: undefined,
			validity: InputValidity.UNSURE
		};
		return newState;
	}
	if (action.type === RATypes.INPUT_SAVE_VALUE) {
		const { inputId, pageId, value, rawValue } = action.payload;
		const key = pageId + "@" + inputId;
		newState[key] = {
			...(newState[key] || {}),
			validity: InputValidity.UNSURE,
			value
		};
		if (typeof(rawValue) !== "undefined") {
			newState[key].rawValue = rawValue;
		}
		return newState;
	}
	if (action.type === RATypes.INPUT_CLEAR_DATA) {
		const { pageId, inputIds } = action.payload;
		if (Array.isArray(inputIds)) {
			inputIds.forEach(inputId => {
				const key = pageId + "@" + inputId;
				delete newState[key];
			});
		} else {
			for (const key in newState) {
				if (key.split("@")[0] === pageId) {
					delete newState[key];
				}
			}
		}
		return newState;
	}
	if (action.type === RATypes.INPUT_SET_DATA) {
		const { inputId, pageId } = action.payload;
		const key = pageId + "@" + inputId;
		newState[key] = {
			...(newState[key] || {})
		};
		for (const k in action.payload) {
			const field = k as keyof RSInput;
			if (!["pageId", "inputId"].includes(field)) {
				newState[key][field] = action.payload[field];
			}
		}
		return newState;
	}
	return state;
};

export default inputReducer;
