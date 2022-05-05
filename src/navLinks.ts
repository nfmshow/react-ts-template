import { PageIds } from "@components/App/routes";

export interface NavLink {
	name: string;
	linkId: string;
	pageId?: string;
	script?: () => Promise<void>;
	requiresLogin: boolean;
	requiresLogout: boolean;
	children?: NavLink[];
}

export const navLinks: NavLink[] = [
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

const nested: NavLink[] = [
	{
		name: "With Grand Children",
		linkId: "WITH_GRAND_CHILDREN",
		requiresLogin: false,
		requiresLogout: false,
		children: navLinks.filter(({ linkId }) => (!(linkId === "WITH_CHILDREN")))
	},
	...navLinks.filter(({ linkId }) => (!(linkId === "WITH_CHILDREN")))
];

for (let i: number = 0; i < navLinks.length; i++) {
	const navLink: NavLink = navLinks[i];
	if (Array.isArray(navLink.children) && navLink.children.length && ((typeof(navLink.script) === "function") || (typeof(navLink.pageId) === "string"))) {
		throw `navLink with linkId ${navLink.linkId} is both clickable and has children`;
	}
	if (navLink.linkId === "WITH_CHILDREN") {
		navLinks[i].children = nested;
	}
}
