/* Weakly Typed */

export interface TaskOptions {
	context?: any;
	args?: any[];
	task: ((...args: any[]) => any);
}

export interface DebouncerOptions {
	interval: number;
	parallel: boolean;
}

export interface Debouncer {
	_nextTask: TaskOptions | undefined;
	_busy: boolean;
	_terminated: boolean;
	_execute: ((this: Debouncer) => void);
	_timeoutId?: ReturnType<typeof setTimeout>;
	terminate: ((this: Debouncer) => void);
	add: ((this: Debouncer, task: TaskOptions) => void);
}

export default function getDebouncer(params: DebouncerOptions): Debouncer {
	const { interval, parallel } = params;
	if (!Number.isInteger(interval) || (interval < 0)) {
		throw "getDebouncer: interval must be a positive integer";
	}
	const debouncer: Debouncer = {
		_busy: false,
		_terminated: false,
		_nextTask: undefined,
		_execute: async function() {
			if (typeof(this._nextTask) === "undefined") {
				return;
			}
			const currentTask: TaskOptions = this._nextTask;
			this._nextTask = undefined;
			const {
				task, 
				args, 
				context
			} = currentTask;
			this._busy = true;
			let taskEnded: boolean = false;
			let timedOut: boolean = false;
			this._timeoutId = setTimeout(
				(function(this: Debouncer): void {
					timedOut = true;
					if (parallel || taskEnded) {
						this._busy = false;
						if (this._nextTask) {
							this._execute();
						}
					}
				}).bind(this),
				interval
			);
			try {
				await Promise.resolve(task.apply(context, args || []));
			} catch(error) {
				console.warn("A debouncer error will be shown below.");
				console.warn(error);
			} finally {
				taskEnded = true;
				if (!parallel && timedOut) {
					this._busy = false;
					if (this._nextTask) {
						this._execute();
					}
				}
			}
		},
		terminate: function() {
			this._terminated = true;
			if (typeof(this._timeoutId) !== "undefined") {
				clearTimeout(this._timeoutId);
			}
			this._nextTask = undefined;
		},
		add: function(task: TaskOptions) {
			if (this._terminated) {
				throw "debouncer.add: debouncer already terminated.";
			}
			this._nextTask = task;
			if (!this._busy) {
				this._execute();
			}
		}
	};
	for (const k in debouncer) {
		const key = k as keyof Pick<Debouncer, "_execute" | "add" | "terminate">;
		if (typeof(debouncer[key]) === "function") {
			// @ts-expect-error Compiler is freaking out because of a simple bind
			debouncer[key] = debouncer[key].bind(debouncer);
		}
	}
	return debouncer;
}