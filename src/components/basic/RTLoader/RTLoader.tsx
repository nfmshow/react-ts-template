import React, { FunctionComponent, ComponentType, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import emitter from "@utils/emitter";
import { RetryableTaskStatus as RTStatus, RSRetryableTask, StateTree } from "@redux/initialState";
import retryable, { RetryableTaskOptions as RTOptions } from "@utils/retryable";
import Spinner from "@components/basic/Spinner";
//import { PageIds } from "@components/App/routes";

export interface RTLoaderExtProps {
	config: Omit<RTOptions<ComponentType>, "breakLoopOnAttempt">;
}

function mapStateToProps(state: StateTree, ownProps: RTLoaderExtProps): RSRetryableTask {
	const loaderId: string = ownProps.config.loaderId;
	const loader: RSRetryableTask = (typeof(state.retryableTask[loaderId]) === "undefined") ? {
		status: RTStatus.LOADING,
		fullLoadingScreen: (typeof(ownProps.config.fullLoadingScreen) === "undefined") ? false : ownProps.config.fullLoadingScreen,
		retryEvent: "",
		loadingText: (typeof(ownProps.config.loadingText) === "undefined") ? "" : ownProps.config.loadingText,
		errorText: (typeof(ownProps.config.errorText) === "undefined") ? "" : ownProps.config.errorText,
	} : { ...state.retryableTask[loaderId] };
	return loader;
}

const connector = connect(mapStateToProps);

type RTLoaderProps = ConnectedProps<typeof connector> & RTLoaderExtProps;

interface RTLState {
	component: ComponentType;
	fetched: boolean;
}

const initialRTLState: RTLState = {
	component: () => (<></>),
	fetched: false,
};

const RTLoader: FunctionComponent<RTLoaderProps> = function(props: RTLoaderProps) {
	const {
		config,
		status,
		retryEvent,
		loadingText,
		errorText
	} = props;
	const [ state, setState ] = useState<RTLState>(initialRTLState);
	const onRetry = function(): void {
		emitter.emit(retryEvent);
	};
	const Component: ComponentType = state.component;
	useEffect(function() {
		retryable<ComponentType>(config)
			.then(function(c) {
				setState({ component: c, fetched: true });
			});
		console.warn("Mounted " + config.loaderId);
	}, []);
	return (
		<div className="w-full h-full absolute flex flex-col">
			{((status === RTStatus.SUCCESS) && state.fetched) ? (
				<Component />
			) : (
				(status === RTStatus.ERROR) ? (
					<div className="w-full h-full p-8 flex flex-col">
						<div className="w-full flex flex-row justify-center pb-6">
							<p className="m-0">
								{errorText}
							</p>
						</div>
						<div className="w-full flex flex-row justify-center">
							
						</div>
					</div>
				) : (
					<div className="w-full h-full p-8 flex flex-col justify-center items-center">
						<div className="w-full flex flex-row justify-center">
							<Spinner scale={1.5} />
						</div>
						<div className="w-full flex flex-row justify-center pt-6">
							<p className="m-0">
								{config.loaderId} {loadingText}
							</p>
						</div>
					</div>
				)
			)}
		</div>
	);
};

export default connector(RTLoader);
