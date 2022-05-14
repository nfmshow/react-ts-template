import { MOBILE_MAX_WIDTH } from "@constants/index";

export interface WindowSize {
	windowWidth: number;
	windowHeight: number;
	mobileView: boolean;
}

export default function getWindowSize(): WindowSize {
	const windowHeight: number = Number((window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight).toFixed(2));
	const windowWidth: number = Number((window.innerWidth || window.document.documentElement.clientWidth || window.document.body.clientWidth).toFixed(2));
	const mobileView: boolean = (windowWidth <= MOBILE_MAX_WIDTH);
	return { windowWidth, windowHeight, mobileView };
}