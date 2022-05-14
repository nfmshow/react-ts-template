export default function getQueryString(params: Record<string, string | string[]>): string {
	let url = "";
	for (const key in params) {
		if (Array.isArray(params[key])) {
			for (let i = 0; i < params[key].length; i++) {
				url = url + params[key][i] + "&";
			}
		} else {
			url = url + params[key] + "&";
		}
	}
	if (url.length) {
		url = url.slice(0, url.length - 1);
	}
	return url;
}