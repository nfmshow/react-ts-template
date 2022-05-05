import { RSInput, RSButton, RSMisc, RTAltButton } from "./initialState";

export const enum RATypes {
	RETRYABLE_TASK_START = "RETRYABLE_TASK",
	RETRYABLE_TASK_ERROR = "RETRYABLE_TASK_ERROR",
	RETRYABLE_TASK_SUCCESS = "RETRYABLE_TASK_SUCCESS",
	MISC_DATA_SET = "MISC_DATA_SET",
	MISC_DATA_SET_UNSAFE = "MISC_DATA_SET_UNSAFE",
	INPUT_VALID = "INPUT_VALID",
	INPUT_INVALID = "INPUT_INVALID",
	INPUT_UNSURE = "INPUT_UNSURE",
	INPUT_SAVE_VALUE = "INPUT_SAVE_VALUE",
	INPUT_SET_DATA = "INPUT_SET_DATA",
	INPUT_CLEAR_DATA = "INPUT_CLEAR_DATA",
	BUTTON_SET_STATE = "BUTTON_SET_STATE",
	BUTTON_CLEAR_STATE = "BUTTON_CLEAR_STATE",
	PAGE_DATA_SET = "SET_PAGE_DATA",
	PAGE_DATA_CLEAR = "PAGE_DATA_CLEAR"
}

export interface RAPRTStart {
	loaderId: string;
	retryEvent: string;
	fullLoadingScreen?: boolean;
	loadingText?: string;
	errorText?: string;
	altButton?: RTAltButton
}

export interface RAPRTSuccess {
	loaderId: string;
}

export interface RAPRTError {
	loaderId: string;
	errorText?: string;
	retryEvent?: string;
	altButton?: RTAltButton;
}

export { RTAltButton } from "./initialState";

export interface RAPButtonSetState extends RSButton {
	buttonId: string;
}

export interface RAPButtonClearState {
	buttonId: string;
}

export interface RAPMiscData {
	data: RSMisc
}

interface RAPMDUObject {
	field: string;
	value: any;
	subfields?: RAPMDUObject[];
}

export interface RAPMiscDataUnsafe {
	data: RAPMDUObject[];
}

export interface RAPPageDataClear {
	pageId: string;
}

export interface RAPPageDataSet {
	pageId: string;
	data: object;
}

export interface RAPInputValid {
	inputId: string;
	pageId: string;
}

export interface RAPInputUnsure {
	inputId: string;
	pageId: string;
}

export interface RAPInputInvalid {
	inputId: string;
	pageId: string;
	errorText: string;
}

export interface RAPInputSaveValue {
	inputId: string;
	pageId: string;
	value: any;
	rawValue?: any;
}

export interface RAPInputClearData {
	pageId: string;
	inputIds: string[];
}

export interface RAPInputSetData extends RSInput {
	inputId: string;
	pageId: string;
}

export interface RARTError {
	type: RATypes.RETRYABLE_TASK_ERROR;
	payload: RAPRTError;
}

export interface RARTSuccess {
	type: RATypes.RETRYABLE_TASK_SUCCESS;
	payload: RAPRTSuccess;
}

export interface RARTStart {
	type: RATypes.RETRYABLE_TASK_START;
	payload: RAPRTStart;
}

export interface RAButtonSetState {
	type: RATypes.BUTTON_SET_STATE;
	payload: RAPButtonSetState;
}

export interface RAButtonClearState {
	type: RATypes.BUTTON_CLEAR_STATE;
	payload: RAPButtonClearState;
}

export interface RAMiscData {
	type: RATypes.MISC_DATA_SET;
	payload: RAPMiscData;
}

export interface RAMiscDataUnsafe {
	type: RATypes.MISC_DATA_SET_UNSAFE;
	payload: RAPMiscDataUnsafe;
}

export interface RAPageDataSet {
	type: RATypes.PAGE_DATA_SET;
	payload: RAPPageDataSet;
}

export interface RAPageDataClear {
	type: RATypes.PAGE_DATA_CLEAR;
	payload: RAPPageDataClear;
}

export interface RAInputValid {
	type: RATypes.INPUT_VALID;
	payload: RAPInputValid;
}

export interface RAInputInvalid {
	type: RATypes.INPUT_INVALID;
	payload: RAPInputInvalid;
}

export interface RAInputUnsure {
	type: RATypes.INPUT_UNSURE;
	payload: RAPInputUnsure;
}

export interface RAInputSaveValue {
	type: RATypes.INPUT_SAVE_VALUE;
	payload: RAPInputSaveValue;
}

export interface RAInputSetData {
	type: RATypes.INPUT_SET_DATA;
	payload: RAPInputSetData;
}

export interface RAInputClearData {
	type: RATypes.INPUT_CLEAR_DATA;
	payload: RAPInputClearData;
}

export type ReduxAction = 
| RARTStart
| RARTSuccess
| RARTError
| RAButtonSetState
| RAButtonClearState
| RAMiscData
| RAPageDataSet
| RAPageDataClear
| RAInputValid
| RAInputInvalid
| RAInputUnsure
| RAInputSaveValue
| RAInputSetData
| RAInputClearData;