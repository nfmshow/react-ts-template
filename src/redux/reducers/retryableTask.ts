import { RATypes, ReduxAction, RAPRTSuccess, RAPRTError, RAPRTStart } from "@redux/actions";
import initialState, { RSTRetryableTask, RSRetryableTask, RetryableTaskStatus } from "@redux/initialState";

type RTReducer = (state: RSTRetryableTask | undefined, action: ReduxAction) => RSTRetryableTask;
const rtReducer: RTReducer = function(state = initialState.retryableTask, action) { 
	const newState = Object.assign({}, state);
	if (action.type === RATypes.RETRYABLE_TASK_SUCCESS) {
		const payload: RAPRTSuccess = action.payload;
		const { loaderId } = payload;
		newState[loaderId] = {
			...(newState[loaderId] || {}),
			status: RetryableTaskStatus.SUCCESS
		};
		return newState;
	}
	if (action.type === RATypes.RETRYABLE_TASK_ERROR) {
		const payload: RAPRTError = action.payload;
		const { loaderId } = payload;
		newState[loaderId] = {
			...(newState[loaderId] || {}),
			status: RetryableTaskStatus.ERROR
		};
		Object.keys(payload)
			.forEach(function(key: string) {
				const field = key as keyof KeysMatching<RAPRTError, RSRetryableTask>;
				if (key !== "loaderId") {
					newState[loaderId][field] = payload[field];
				}
			});
		return newState;
	}
	if (action.type === RATypes.RETRYABLE_TASK_START) {
		const payload: RAPRTStart = action.payload;
		const { loaderId } = payload;
		newState[loaderId] = {
			...(newState[loaderId] || {}),
			status: RetryableTaskStatus.LOADING
		};
		if (typeof(payload.loadingText) === "undefined") {
			newState[loaderId].loadingText = "Just a moment...";
		}
		if (typeof(payload.errorText) === "undefined") {
			newState[loaderId].errorText = "Sorry. An error occurred. Please try again";
		}
		if (typeof(payload.fullLoadingScreen) === "undefined") {
			newState[loaderId].fullLoadingScreen = false;
		}
		Object.keys(payload)
			.forEach(function(key: string) {
				const field = key as keyof KeysMatching<RAPRTStart, RSRetryableTask>;
				if (key !== "loaderId") {
					newState[loaderId][field] = payload[field];
				}
			});
		return newState;
	}
	return state;
};

export default rtReducer;