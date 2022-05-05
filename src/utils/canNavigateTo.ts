import { Page } from "@components/App/routes";

export default async function canNavigateTo(page: Page): Promise<boolean> {
	return true;
}