import { PageIds } from "@components/App/routes";

export interface Navlink {
	name: string;
	linkId: string;
	pageId?: string;
	script?: () => Promise<void>;
	requiresLogin: boolean;
	requiresLogout: boolean;
	children?: Navlink[];
}

export const navlinks: Navlink[] = [
	{
		name: "Home",
		linkId: PageIds.HOME,
		pageId: PageIds.HOME,
		requiresLogin: false,
		requiresLogout: false
	},
	{
		name: "With Children",
		linkId: "WITH_CHILDREN",
		requiresLogin: false,
		requiresLogout: false,
		children: []
	},
	{
		name: "Test",
		linkId: PageIds.TEST,
		pageId: PageIds.TEST,
		requiresLogin: false,
		requiresLogout: false
	},
	{
		name: "Logout",
		linkId: "LOGOUT",
		requiresLogin: false,
		requiresLogout: false,
		script: async function() {
			return;
		}
	}
];

const nested: Navlink[] = [
	{
		name: "With Grand Children",
		linkId: "WITH_GRAND_CHILDREN",
		requiresLogin: false,
		requiresLogout: false,
		children: navlinks.filter(({ linkId }) => (!(linkId === "WITH_CHILDREN")))
	},
	...navlinks.filter(({ linkId }) => (!(linkId === "WITH_CHILDREN")))
];

for (let i: number = 0; i < navlinks.length; i++) {
	const navlink: Navlink = navlinks[i];
	if (Array.isArray(navlink.children) && navlink.children.length && ((typeof(navlink.script) === "function") || (typeof(navlink.pageId) === "string"))) {
		throw `navlink with linkId ${navlink.linkId} is both clickable and has children`;
	}
	if (navlink.linkId === "WITH_CHILDREN") {
		navlinks[i].children = nested;
	}
}
