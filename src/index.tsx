import * as React from "react";
import { render } from "preact";
import "./css/main.css";
import App from "@components/App";

interface RootLoader {
	show: () => void;
	hide: () => void;
	oContainer: HTMLElement;
}

declare global {
	interface Window {
		onInitialContentLoad: () => void;
		rootLoader: RootLoader;
	}
	type AnyFunction = ((...args: any[]) => any)
	type KeysMatching<A, B> = {[k in keyof A]: A[k] extends B ? k : never}[keyof A] 
}

window.onInitialContentLoad = function() {
	const root: HTMLElement = document.getElementById("root")!;
	render(<App />, root);
};