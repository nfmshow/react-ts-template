import { dispatch } from "@redux/store";
import emitter from "@utils/emitter";
import { RATypes, RAPRTStart, RARTStart, RARTSuccess, RARTError } from "@redux/actions";

export interface AltButtonOptions {
	text: string;
	onClick: (...args: any[]) => any;
	icon?: string;
}

export interface RetryableTaskOptions<TaskReturnType> {
	loaderId: string;
	task: (...args: any[]) => Promise<TaskReturnType>;
	loadingText?: string;
	errorText?: string;
	fullLoadingScreen?: boolean;
	context?: any;
	args?: any[];
	breakLoopOnAttempt?: number;
	minDuration?: number;
	altButton?: AltButtonOptions
}

interface BreakLoopOptions<TaskReturnType> {
	status: "SUCCESS" | "ERROR";
	data?: TaskReturnType;
	error?: any;
}

export default function retryable<TaskReturnType>(params: RetryableTaskOptions<TaskReturnType>): Promise<TaskReturnType> {
	const { loaderId, task } = params;
	const retryEvent = `${loaderId}:RETRY`;
	const args: any[] = Array.isArray(params.args) ? params.args : [];
	const context: any = (typeof(params.context) === "undefined") ? null : params.context;
	const minDuration: number = (typeof(params.minDuration) === "undefined") ? 1000 : params.minDuration;
	const breakLoopOnAttempt: number = (typeof(params.breakLoopOnAttempt) === "undefined") ? 100000 : params.breakLoopOnAttempt;
	let attempts: number = 0;
	if (!Number.isInteger(minDuration)) {
		throw "retryable: \"minDuration\" must be an integer";
	}
	if (!Number.isInteger(breakLoopOnAttempt)) {
		throw "retryable: \"breakLoopOnAttempt\" must be an integer";
	}
	const startPayload: RAPRTStart = {
		loaderId,
		retryEvent
	};
	if (typeof(params.loadingText) !== "undefined") {
		startPayload.loadingText = params.loadingText;
	}
	if (typeof(params.errorText) !== "undefined") {
		startPayload.errorText = params.errorText;
	}
	if (typeof(params.fullLoadingScreen) !== "undefined") {
		startPayload.fullLoadingScreen = params.fullLoadingScreen;
	}
	if (typeof(params.altButton) !== "undefined") {
		startPayload.altButton = {
			text: params.altButton.text,
			onClickEvent: `${loaderId}:ALT_BUTTON_CLICK`
		};
		if (typeof(params.altButton.icon) !== "undefined") {
			startPayload.altButton.icon = params.altButton.icon;
		}
	}
	function makeAttempt(resolve: AnyFunction, reject: AnyFunction): void {
		const startTime: number = Date.now();
		function ensureMinDuration(): Promise<void> {
			const duration = Date.now() - startTime;
			return new Promise(function(resolve: AnyFunction) {
				if (duration >= minDuration) {
					resolve();
					return;
				}
				setTimeout(resolve, minDuration - duration);
			});
		}
		function breakLoop(exitOptions: BreakLoopOptions<TaskReturnType>): void {
			dispatch<RARTSuccess>({
				type: RATypes.RETRYABLE_TASK_SUCCESS,
				payload: { loaderId }
			});
			if (exitOptions.status === "ERROR") {
				reject(exitOptions!.error);
			}
			resolve(exitOptions!.data);
		}
		attempts++;
		dispatch<RARTStart>({
			type: RATypes.RETRYABLE_TASK_START,
			payload: startPayload
		});
		Promise.resolve(task.apply(context, args))
			.then(function(data: TaskReturnType) {
				ensureMinDuration()
					.then(function() {
						breakLoop({
							status: "SUCCESS",
							data
						});
					});
			}).catch(function(error) {
				console.error(error);
				ensureMinDuration()
					.then(function() {
						if (breakLoopOnAttempt && (breakLoopOnAttempt === attempts)) {
							return breakLoop({
								status: "ERROR",
								error
							});
						}
						emitter.once(retryEvent, () => makeAttempt(resolve, reject));
						dispatch<RARTError>({
							type: RATypes.RETRYABLE_TASK_ERROR,
							payload: { loaderId }
						});
					});
			});
	}
	return new Promise((resolve: AnyFunction, reject: AnyFunction) => makeAttempt(resolve, reject));
}