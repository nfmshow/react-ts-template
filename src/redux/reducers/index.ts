import { combineReducers } from "redux";
import retryableTask from "./retryableTask";
import misc from "./misc";
import buttons from "./buttons";
import pages from "./pages";
import input from "./input";

const rootReducer = combineReducers({
	retryableTask,
	misc,
	input,
	buttons,
	pages
});

export default rootReducer;