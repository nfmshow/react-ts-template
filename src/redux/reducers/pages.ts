import { RATypes, ReduxAction } from "@redux/actions";
import initialState, { RSTPageData } from "@redux/initialState";

type PDReducer = (state: RSTPageData | undefined, action: ReduxAction) => RSTPageData;
const pdReducer: PDReducer = function(state = initialState.pages, action) {
	const newState = Object.assign({}, state);
	if (action.type === RATypes.PAGE_DATA_SET) {
		const { pageId, data } = action.payload;
		if (!newState[pageId]) {
			newState[pageId] = {};
		}
		newState[pageId] = {
			...newState[pageId],
			...data
		};
		return newState;
	}
	if (action.type === RATypes.PAGE_DATA_CLEAR) {
		const { pageId } = action.payload;
		newState[pageId] = {};
		return newState;
	}
	return state;
};

export default pdReducer;
