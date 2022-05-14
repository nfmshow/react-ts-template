import { ComponentType } from "react";
import { onFirstPageMount } from "@utils/history";
import { PageIds } from "@pages/index";

import Home, { ont as ontHome } from "@pages/Home";
import Test, { ont as ontTest } from "@pages/Test";
import NotFound, { ont as ontNotFound } from "@pages/NotFound";

export { PageIds, isPageId } from "@pages/index";

type PageFetcher = (() => Promise<ComponentType>);

function getPageFetcher(component: ComponentType): PageFetcher {
	return function fetchNow(): Promise<ComponentType> {
		return new Promise((resolve: AnyFunction) => resolve(component));
	};
}

let firstPageRendered: boolean = false;

function getLoaderTask(page: PageNLT): PageFetcher {
	return function loaderTask(): Promise<ComponentType> {
		if (!firstPageRendered) {
			setTimeout(function() {
				onFirstPageMount(page.pageId, page.animateRank);
			}, 50);
			firstPageRendered = true;
		}
		/*
			Check for permission,
			Run onNavigateTo
		*/
		return page.fetcher();
	};
}

export interface PageNLT {
	pageId: PageIds;
	path: string;
	canNavigateTo?: () => Promise<boolean>;
	onNavigateTo?: () => Promise<void>;
	backButtonHandler?: () => Promise<boolean | string>;
	vipQueryParams?: string[];
	requiresLogin: boolean;
	requiresLogout: boolean;
	fetcher: PageFetcher;
	animateRank: number;
}

export interface Page extends PageNLT {
	loaderTask: PageFetcher
}

const pagesNLT: PageNLT[] = [
	{
		pageId: PageIds.NOT_FOUND,
		path: "*",
		onNavigateTo: ontNotFound,
		requiresLogin: false,
		requiresLogout: false,
		animateRank: 101,
		fetcher: getPageFetcher(NotFound)
	},
	{
		pageId: PageIds.HOME,
		path: "/",
		onNavigateTo: ontHome,
		requiresLogin: false,
		requiresLogout: false,
		animateRank: 100,
		fetcher: getPageFetcher(Home)
	},
	{
		pageId: PageIds.TEST,
		path: "/test",
		onNavigateTo: ontTest,
		requiresLogin: false,
		requiresLogout: false,
		animateRank: 101,
		fetcher: getPageFetcher(Test)
	}
];

export const pagesMap: Record<string, Page> = {};

export const pages = pagesNLT.map(function(pageNLT: PageNLT): Page {
	const page = {
		...pageNLT,
		loaderTask: getLoaderTask(pageNLT)
	};
	pagesMap[page.pageId] = page;
	return page;
});

