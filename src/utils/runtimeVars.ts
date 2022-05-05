interface NavigateOptions {
	replace?: boolean;
	state?: any;
}

interface Navigate {
    (to: string, options?: NavigateOptions): void;
    (delta: number): void;
}

export interface Location {
	pathname: string;
	search: string;
	hash: string;
	key: string;
	state: any;
}

interface RuntimeVars {
	navigate?: Navigate;
	location?: Location;
	expectInvalidNavigation: boolean;
}

const runtimeVars: RuntimeVars = {
	expectInvalidNavigation: false
};

export default runtimeVars;
