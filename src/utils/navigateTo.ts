import { matchPath } from "react-router-dom";
import { pages, Page, PageIds } from "@components/App/routes";
import { getState, dispatch } from "@redux/store";
import { RATypes, RAMiscData } from "@redux/actions";
import { PageAnimDirection } from "@redux/initialState";
//import canNavigateTo from "@utils/canNavigateTo";
import runtimeVars from "@utils/runtimeVars";
import wait from "@utils/wait";
import getQueryParams from "@utils/getQueryParams";
import { recordNavigation } from "@utils/history";
import navQueue from "@utils/navQueue";
import { PAGE_ANIM_DURATION } from "@constants/index";

async function task(url: string, pageId: PageIds): Promise<void> {
	if ((typeof(runtimeVars.navigate) === "undefined") || (typeof(runtimeVars.location) === "undefined")) {
		// Toast here
		return;
	}
	const { misc: { currentPageId } } = getState();
	const affectedPages: Record<string, Page> = {};
	for (let i = 0; i < pages.length; i++) {
		if ((typeof(currentPageId) !== "undefined") && (pages[i].pageId === currentPageId)) {
			affectedPages.current = pages[i];
		}
		if (pages[i].pageId === pageId) {
			affectedPages.next = pages[i];
		}
		if (
			(typeof(affectedPages.next) !== "undefined") && 
			((typeof(currentPageId) === "undefined") || (typeof(affectedPages.current) !== "undefined"))
		) {
			break;
		}
	}
	if (!affectedPages.next) {
		// Very unlikely to ever execute
		throw "navigateTo: Invalid pageId specified";
	}
	const matchedPath = matchPath(affectedPages.next.path, url);
	if (!matchedPath) {
		// Maybe take to 404 page => await navigateTo(url, page404Id);
		throw "navigateTo: URL specified does not match pageId specified";
	}
	let animate: boolean = true;
	if (pageId === currentPageId) {
		const currentPath: string = runtimeVars.location.pathname;
		const currentQueryParams: Record<string, string | string[]> = getQueryParams(runtimeVars.location.search);
		const currentHash = runtimeVars.location.hash;
		const nextPath = url.split("?")[0]!;
		let nextQS: string = url.split("?")[1] || "";
		nextQS = nextQS.split("#")[0]!;
		const nextQueryParams: Record<string, string | string[]> = getQueryParams(nextQS);
		const nextHash: string = url.split("#")[0] || "";
		let mismatch: boolean = false;
		animate = false;
		if (currentPath !== nextPath) {
			mismatch = true;
			animate = true;
		}
		if (!mismatch && (currentHash !== nextHash)) {
			mismatch = true;
		}
		const qpmDisallowed: string[] = Array.isArray(affectedPages.next.vipQueryParams) ? affectedPages.next.vipQueryParams : [];
		const qpm: string[] = [];
		for (const key in currentQueryParams) {
			if (JSON.stringify(currentQueryParams[key]) !== JSON.stringify(nextQueryParams[key])) {
				if (!mismatch) {
					mismatch = true;
				}
				if (!qpm.includes(key)) {
					qpm.push(key);
				}
			}
		}
		for (const key in nextQueryParams) {
			if (JSON.stringify(nextQueryParams[key]) !== JSON.stringify(currentQueryParams[key])) {
				if (!mismatch) {
					mismatch = true;
				}
				if (!qpm.includes(key)) {
					qpm.push(key);
				}
			}
		}
		if (!mismatch) {
			return;
		}
		if (!animate && (qpm.filter((qp) => qpmDisallowed.includes(qp)).length > 1)) {
			animate = true;
		}
	}
	//const rankDiff: number = (typeof(affectedPages.current) === "undefined") ? affectedPages.next.animateRank : (affectedPages.next.animateRank - affectedPages.current.animateRank);
	const pageAnimDirection: PageAnimDirection = PageAnimDirection.BACKWARD; //(rankDiff > 0) ? PageAnimDirection.BACKWARD : PageAnimDirection.FORWARD;
	runtimeVars.expectInvalidNavigation = true;
	runtimeVars.navigate(1);
	await wait(20);
	dispatch<RAMiscData>({
		type: RATypes.MISC_DATA_SET,
		payload: {
			data: {
				pageAnimDirection,
				pageAnimEnabled: animate,
			}
		}
	});
	await wait(1);
	recordNavigation({
		animRank: affectedPages.next.animateRank,
		url,
		pageId,
		animated: animate
	});
	// These four navigations will impact performance significantly
	runtimeVars.navigate(url, { state: { type: "BACK_PROXY" } });
	runtimeVars.navigate(url, { state: { type: "REAL" } });
	runtimeVars.navigate(url, { state: { type: "FRONT_PROXY" } });
	runtimeVars.navigate(-1);
	await wait(animate ? PAGE_ANIM_DURATION : 1);
	dispatch<RAMiscData>({
		type: RATypes.MISC_DATA_SET,
		payload: {
			data: {
				currentPageId: pageId,
				currentPageURL: url,
				pageAnimEnabled: false
			}
		}
	});
	await wait(1);
}

export default async function navigateTo(url: string, pageId: PageIds): Promise<void> {
	await navQueue.asyncAdd({
		task: function() {
			return task(url, pageId);
		}
	});
}