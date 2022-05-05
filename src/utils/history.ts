import { createBrowserHistory } from "history";
import runtimeVars, { Location } from "@utils/runtimeVars";
import wait from "@utils/wait";
import { dispatch } from "@redux/store";
import { RATypes, RAMiscData } from "@redux/actions";
import { PageAnimDirection } from "@redux/initialState";
import { PAGE_ANIM_DURATION } from "@constants/index";
import navQueue from "@utils/navQueue";
//import backButtonHandler from "@utils/backButtonHandler";

const history = createBrowserHistory();

export interface HistoryEntry {
	url: string;
	animated: boolean;
	pageId: string;
	animRank: number;
}

const locationKeys: string[] = [];
let realHistory: HistoryEntry[] = [];
let currentIndex: number = 0;

export function recordNavigation(entry: HistoryEntry): void {
	realHistory = realHistory.slice(0, currentIndex + 1);
	realHistory.push(entry);
	currentIndex = realHistory.length - 1;
}

export function onFirstPageMount(pageId: string, animRank: number): void {
	const urlPartsA: string[] = window.location.href.split("//");
	const url = "/" + urlPartsA[1]!.split("/").filter(function(part: string, index: number): boolean {
		return (index !== 0);
	}).join("/");
	runtimeVars.navigate!(url, { state: { type: "FRONT_PROXY" } });
	runtimeVars.navigate!(-1);
	recordNavigation({
		url,
		pageId: pageId,
		animated: true,
		animRank: animRank
	});
	dispatch<RAMiscData>({
		type: RATypes.MISC_DATA_SET,
		payload: {
			data: {
				currentPageId: pageId,
				currentPageURL: url
			}
		}
	});
}

async function popTask(backward: boolean, magnitude: number): Promise<void> {
	if (!Number.isInteger(magnitude) || (magnitude < 1)) {
		throw "history.pop: magnitude must be a positive integer";
	}
	const target: HistoryEntry = realHistory[backward ? (currentIndex - magnitude) : (currentIndex + magnitude)];
	if (typeof(target) === "undefined") {
		if (runtimeVars.expectInvalidNavigation) {
			runtimeVars.expectInvalidNavigation = false;
			return;
		}
		console.warn("history.pop: Invalid navigation attempt");
		runtimeVars.navigate!(backward ? 1*magnitude : -1*magnitude);
		return;
	}
	//Run backButtonHandler here to validate navigation. If invalid, reset
	const animate: boolean = true; // Possibly make non-conditional in future
	//const rankDiff: number = realHistory[currentIndex].animRank - target.animRank;
	const animDirection = backward ? PageAnimDirection.FORWARD : PageAnimDirection.BACKWARD;
	await wait(1);
	dispatch<RAMiscData>({
		type: RATypes.MISC_DATA_SET,
		payload: {
			data: {
				pageAnimDirection: animDirection,
				pageAnimEnabled: animate
			}
		}
	});
	await wait(1);
	const steps: number = (3*(magnitude - 1) + 2);//(backward && ((currentIndex - magnitude) === 0)) ? 1 : (3*(magnitude - 1) + 2);
	runtimeVars.navigate!(backward ? -1*steps : 1*steps);
	currentIndex = currentIndex + (backward ? ( -1*magnitude) : (1*magnitude));
	await wait(animate ? (PAGE_ANIM_DURATION*1.5) : 1);
	dispatch<RAMiscData>({
		type: RATypes.MISC_DATA_SET,
		payload: {
			data: {
				currentPageId: target.pageId,
				currentPageURL: target.url,
				pageAnimEnabled: false
			}
		}
	});
	await wait(1);
}

async function pop(backward: boolean, magnitude: number): Promise<void> {
	await navQueue.asyncAdd({
		task: function() {
			return popTask(backward, magnitude);
		}
	});
}

interface ListenerArgs {
	location: Location;
	action: string;
}

function listener(e: ListenerArgs): void {
	const { location, action } = e;
	if (action === "POP") {
		if (location.state) {
			if ((typeof(location.state!.type) === "undefined") || (location.state!.type === "BACK_PROXY")) {
				pop(true, 1);
			} else {
				if (location.state!.type === "FRONT_PROXY") {
					pop(false, 1);
				}
			}
		}
	}
	locationKeys.push(location.key);
}

history.listen(listener);

export default history;