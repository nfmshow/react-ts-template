import React, { Component } from "react";
import { Provider } from "react-redux";
import { RATypes, RAMiscData } from "@redux/actions";
import store, { dispatch } from "@redux/store";
import Router from "./Router";
import { ModalRoot } from "@components/basic/Modal";
import getDebouncer, { Debouncer } from "@utils/getDebouncer";
import getWindowSize from "@utils/getWindowSize";

export interface AppProps {
	twccBg?: string;
}

export default class App extends Component<AppProps> {
	constructor(props: AppProps) {
		super(props);
		this.wuDebouncer = getDebouncer({
			interval: 300,
			parallel: false
		});
	}
	
	wuDebouncer: Debouncer;
	
	onWindowSizeChange = (): void => {
		this.wuDebouncer.add({
			task: () => {
				const { windowWidth, windowHeight, mobileView } = getWindowSize();
				dispatch<RAMiscData>({
					type: RATypes.MISC_DATA_SET,
					payload: {
						data: {
							windowWidth,
							windowHeight,
							mobileView 
						}
					}
				});
			}
		});
	};
	
	componentDidMount() {
		window.rootLoader.hide();
		this.onWindowSizeChange();
		window.addEventListener("resize", this.onWindowSizeChange);
	}
	
	render() {
		const twccBg = this.props.twccBg  || "bg-primary-50";
		return(
			<Provider store={store}>
				<div className={`flex flex-col w-full h-full ${twccBg}`}>
					<div className="w-full toaster z-50">
						
					</div>
					<div className="w-full fixed modal z-40">
						<ModalRoot />
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
	}
}