export const enum InputValidity {
	UNSURE = "UNSURE",
	VALID = "VALID",
	INVALID = "INVALID"
}

export const enum RetryableTaskStatus {
	SUCCESS = "SUCCESS",
	LOADING = "LOADING",
	ERROR = "ERROR"
}

export const enum FlashMessageType {
	INFO = "INFO",
	SUCCESS = "SUCCESS",
	ERROR = "ERROR",
}

export const enum PageAnimDirection {
	FORWARD = "FORWARD",
	BACKWARD = "BACKWARD"
}

export interface RSInput {
	items?: any[];
	errorText?: string;
	validity?: InputValidity;
	value?: any;
	rawValue?: any;
}

export interface RTAltButton {
	text: string;
	icon?: string;
	onClickEvent: string;
}

export interface RSRetryableTask {
	status: RetryableTaskStatus;
	fullLoadingScreen: boolean;
	retryEvent: string;
	metadata?: any;
	loadingText?: string;
	errorText?: string;
	altButton?: RTAltButton
}

export interface RSMisc {
	isLoggedIn?: boolean;
	mobileView?: boolean;
	windowWidth?: number;
	windowHeight?: number;
	appMounted?: boolean;
	firstPageMounted?: boolean;
	flashMessage?: string;
	flashMessageType?: FlashMessageType;
	pageAnimDirection?: PageAnimDirection;
	pageAnimEnabled?: boolean;
	currentPageId?: string;
	currentPageURL?: string;
}

export interface RSButton {
	loading: boolean;
}

export type RSTButton = Record<string, RSButton>;
export type RSTRetryableTask = Record<string, RSRetryableTask>;
export type RSTPageData = Record<string, object>;
export type RSTInput = Record<string, RSInput>;

export interface StateTree {
	retryableTask: RSTRetryableTask;
	pages: RSTPageData;
	misc: RSMisc;
	input: RSTInput;
	buttons: RSTButton;
}

export const initialMiscData: Required<Pick<RSMisc, "pageAnimDirection" | "pageAnimEnabled">> = {
	pageAnimDirection: PageAnimDirection.BACKWARD,
	pageAnimEnabled: false
};

const initialState: StateTree = {
	retryableTask: {},
	pages: {},
	input: {},
	buttons: {},
	misc: {
		...initialMiscData
	}
};

export default initialState;
