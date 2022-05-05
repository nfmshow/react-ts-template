export const PageIds = {
	HOME: "HOME",
	TEST: "TEST",
	NOT_FOUND: "NOT_FOUND"
} as const;

export type PageIds = typeof PageIds[keyof typeof PageIds];

export function isPageId(value: any): value is PageIds {
	return Object.values(PageIds).includes(value as PageIds);
}

/*
GetIsEnum: function<T>(et: T): ((value: any) => value is T[keyof T]) {
	return Object.values(et).includes(value as T[keyof T]);
}
*/