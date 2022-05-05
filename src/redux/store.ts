//import thunk from "redux-thunk";
import { createStore } from "redux";
import rootReducer from "./reducers";
import initialState from "./initialState";
//import { ReduxAction } from "./action";

const store = createStore(rootReducer, initialState);
export const { getState, dispatch } = store;
export default store;

