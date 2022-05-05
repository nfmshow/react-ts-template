import { MouseEvent } from "react";
import navigateTo from "@utils/navigateTo";
import getQueryString from "@utils/getQueryString";
import { PageIds, isPageId } from "@pages/index";
import { pagesMap } from "@components/App/routes";

interface LinkA {
	pageId: PageIds;
	path: string;
	query?: Record<string, string[] | string>;
	hash?: string;
}

interface LinkB {
	pageId: PageIds;
	url: string;
}

interface LinkC {
	extURL: string;
	newTab?: boolean;
}

function isLinkA(link: any): link is LinkA {
	return (link.pageId !== "undefined") && (link.path !== "undefined");
}

function isLinkB(link: any): link is LinkB {
	return (link.pageId !== "undefined") && (link.url !== "undefined");
}

function isLinkC(link: any): link is LinkC {
	return (link.extURL !== "undefined");
}

export type Link = LinkA | LinkB | LinkC | PageIds;

export interface LinkProps {
	href: string;
	"data-link"?: string;
	target?: string;
}

export function getLinkProps(link: Link): LinkProps {
	if (isPageId(link)) {
		const page = pagesMap[link];
		if (typeof(page) === "undefined") {
			throw "getLinkProps: Invalid pageId supplied";
		}
		if (page.path.includes(":")) {
			throw "getLinkProps: A route with variable param(s) cannot be specified by pageId only. A url or path must also be specified with it";
		}
		return {
			href: page.path,
			"data-link": JSON.stringify({ pageId: page.pageId })
		};
	}
	if (isLinkB(link)) {
		if (link.url.includes("http://") || link.url.includes("https://")) {
			throw "getLinkProps: url supplied must not be relative to the origin. i.e. stripped of the domain name";
		}
		return {
			href: link.url,
			"data-link": JSON.stringify({ pageId: link.pageId })
		};
	}
	if (isLinkC(link)) {
		if (!link.extURL.includes("http://") && !link.extURL.includes("https://")) {
			throw "getLinkProps: Any external link supplied must include a fully qualified domain name with the protocol";
		}
		const props: LinkProps = { href: link.extURL };
		if ((typeof(link.newTab) !== "undefined") || link.newTab) {
			props.target = "_blank";
		}
		return props;
	}
	if (link.path.includes("http://") || link.path.includes("https://")) {
		throw "getLinkProps: path supplied must be relative to the domain name.";
	}
	if (link.path.includes("?") || link.path.includes("#")) {
		throw "getLinkProps: query or hash parameters must not be included in path. Use the url field instead.";
	}
	let url = link.path;
	if ((typeof(link.query) !== "undefined") && Object.keys(link.query).length) {
		url = url + "?" + getQueryString(link.query);
	}
	if (typeof(link.hash) === "string") {
		url = url + "#" + link.hash;
	}
	return {
		href: url,
		"data-link": JSON.stringify({ pageId: link.pageId })
	};
}
 
export async function onLinkClick(e: MouseEvent<HTMLElement> | Link): Promise<void> {
	if (isPageId(e)) {
		const page = pagesMap[e];
		if (typeof(page) === "undefined") {
			throw "onLinkClick: Invalid pageId supplied";
		}
		await navigateTo(page.path, page.pageId);
		return;
	}
	if (isLinkB(e)) {
		if (e.url.includes("http://") || e.url.includes("https://")) {
			throw "onLinkClick: url supplied must not be relative to the origin.";
		}
		await navigateTo(e.url, e.pageId);
		return;
	}
	if (isLinkC(e)) {
		if (!e.extURL.includes("http://") && !e.extURL.includes("https://")) {
			throw "onLinkClick: Any external link supplied must include a fully qualified domain name with the protocol";
		}
		if ((typeof(e.newTab) !== "undefined") || e.newTab) {
			const link: HTMLAnchorElement = document.createElement('a');
			link.setAttribute('href', e.extURL);
			link.setAttribute('target', '_blank');
			link.click();
			return;
		}
		window.location.href = e.extURL;
		return;
	}
	if (isLinkA(e)) {
		if (e.path.includes("http://") || e.path.includes("https://")) {
			throw "onLinkClick: path supplied must be relative to the domain name.";
		}
		if (e.path.includes("?") || e.path.includes("#")) {
			throw "onLinkClick: query or hash parameters must not be included in path. Use the url field instead.";
		}
		let url = e.path;
		if ((typeof(e.query) !== "undefined") && Object.keys(e.query).length) {
			url = url + "?" + getQueryString(e.query);
		}
		if (typeof(e.hash) === "string") {
			url = url + "#" + e.hash;
		}
		await navigateTo(url, e.pageId);
		return;
	}
	const href = e.currentTarget.getAttribute("href");
	const linkData = e.currentTarget.getAttribute("data-link");
	if ((typeof(href) !== "string") || !href.length) {
		throw "onLinkClink: Element does not have a valid href attribute";
	}
	if ((typeof(linkData) !== "string") || !linkData.length) {
		// Let event be handled
		return;
	}
	e.preventDefault();
	let linkDataP: Record<string, string> = {};
	try {
		linkDataP = JSON.parse(linkData);
	} catch(error) {
		throw `onLinkClick: Failed to parse "data-link" attribute of element`;
	}
	const pageId: string = linkDataP.pageId!;
	if (!isPageId(pageId)) {
		throw "onLinkClick: Invalid pageId passed as data attribute to element.";
	}
	await navigateTo(href, pageId);
}