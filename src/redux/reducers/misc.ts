import { RATypes, ReduxAction } from "@redux/actions";
import initialState, { RSMisc } from "@redux/initialState";

type MiscReducer = (state: RSMisc | undefined, action: ReduxAction) => RSMisc;
const miscReducer: MiscReducer = function(state = initialState.misc, action) {
	let newState: RSMisc = Object.assign({}, state);
	if (action.type === RATypes.MISC_DATA_SET) {
		newState = {
			...newState,
			...action.payload.data
		};
		return newState;
	}
	/*
	if (action.type === RATypes.MISC_DATA_SET_UNSAFE) {
		const { data } = action.payload;
		for (let i = 0; i < data.length; i++) {
			const {
				field,
				value,
				subfields
			} = data[i];
			if (typeof(value) !== 'undefined') {
				newState[field] = value;
				if (Array.isArray(subfields)) {
					console.warn('You cannot set a top level misc field and update its subfields at the same time');
				}
			}
			else if (Array.isArray(subfields) && subfields.length) {
				newState[field] = {
					...(newState[field] || {})
				};
				for (let j = 0; j < subfields.length; j++) {
					const {
						field: nestedField,
						value: nestedValue
					} = subfields[j];
					newState[field][nestedField] = nestedValue;
				}
			}
		}
		return newState;
	}
	*/
	return state;
};

export default miscReducer;
