import React, { FunctionComponent, useEffect, useLayoutEffect } from "react";
import { Provider } from "react-redux";
import store from "@redux/store";
import Router from "./Router";

export interface AppProps {
	twccBg?: string;
}

const App: FunctionComponent<AppProps> = function(props: AppProps) {
	const twccBg = props.twccBg  || "bg-primary-50";
	useEffect(function() {
		window.rootLoader.hide();
	}, []);
	return (
		<Provider store={store}>
			<div className={`flex flex-col w-full h-full ${twccBg}`}>
				<div className="w-full toaster z-50">
					
				</div>
				<div className="w-full modal z-40">
					
				</div>
				<div className="w-full header grow-0 z-30">
					
				</div>
				<div className="w-full grow body">
					<Router />
				</div>
				<div className="w-full grow-0 footer">
					
				</div>
				<div className="w-full grow-0 mobile-footer-tab z-20">
					
				</div>
			</div>
		</Provider>
	);
};

export default App;