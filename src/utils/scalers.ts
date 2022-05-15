import getWindowSize from "@utils/getWindowSize";
import {
	REF_WIDTH_MOBILE,
	REF_WIDTH_DESKTOP,
	REF_HEIGHT_MOBILE,
	REF_HEIGHT_DESKTOP
} from "@constants/index";

export function horzScale(value: number): number {
	const { mobileView, windowWidth } = getWindowSize();
	const fraction: number = mobileView ? (windowWidth/REF_WIDTH_MOBILE) : (windowWidth/REF_WIDTH_DESKTOP);
	return fraction*value;
}

export function vertScale(value: number): number {
	const { mobileView, windowHeight } = getWindowSize();
	const fraction: number = mobileView ? (windowHeight/REF_HEIGHT_MOBILE) : (windowHeight/REF_HEIGHT_DESKTOP);
	return fraction*value;
}

export function hybridScale(value: number, widthBias: number): number {
	if ((widthBias < 0) || (widthBias > 1)) {
		throw "hybridScale: widthBias must be a number between 0 an 1";
	}
	return widthBias*horzScale(value) + (1 - widthBias)*vertScale(value);
}

