export default function getQueryParams(qs?: string): Record<string, string | string[]> {
	const query: string = (typeof(qs) === "undefined") ? window.location.search.substring(1) : qs;
	const vars: string[] = query.split("&");
	const strParams: Record<string, string> = {};
	const arrParams: Record<string, string[]> = {};
	for (let i: number = 0; i < vars.length; i++) {
		const pair: string[] = vars[i].split("=");
		if (pair.length === 2) {
			if (Array.isArray(arrParams[pair[0]])) {
				arrParams[pair[0]].push(pair[1]);
			} else if (typeof(strParams[pair[0]]) === "string") {
				arrParams[pair[0]] = [
					strParams[pair[0]],
					pair[1]
				];
				delete strParams[pair[0]];
			} else {
				strParams[pair[0]] = pair[1];
			}
		}
	}
	for (const key in arrParams) {
		arrParams[key] = arrParams[key].sort(function(A: string, B: string): number {
			return A.localeCompare(B);
		});
	}
	return {
		...strParams,
		...arrParams
	};
}