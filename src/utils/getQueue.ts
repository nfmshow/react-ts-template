/* Weakly Typed */

const enum TaskResultStatus {
	SUCCESS = "SUCCESS",
	ERROR = "ERROR"
}

export interface TaskResult {
	status: TaskResultStatus;
	error: any;
	result: any;
}

export interface TaskOptions {
	context?: any;
	args?: any[];
	task: ((...args: any[]) => any);
	onTaskEnd?: ((opts: TaskResult) => void);
}

export interface Queue {
	_tasks: TaskOptions[];
	_busy: boolean;
	_process: ((this: Queue) => void);
	_onFinish: ((this: Queue) => void);
	add: ((this: Queue, opts: TaskOptions) => void);
	asyncAdd: ((this: Queue, opts: TaskOptions) => Promise<any>);
}

export default function getQueue(): Queue {
	const queue: Queue = {
		_tasks: [],
		_busy: false,
		add: function(task: TaskOptions) {
			this._tasks.push(task);
			if (!this._busy) {
				this._process();
			}
		},
		asyncAdd: function(task: TaskOptions) {
			return new Promise((resolve: AnyFunction, reject: AnyFunction) => {
				this._tasks.push({
					...task,
					onTaskEnd: function(params): void {
						if (params.status === TaskResultStatus.SUCCESS) {
							resolve(params.result);
							return;
						}
						reject(params.error);
					}
				});
				if (!this._busy) {
					this._process();
				}
			});
		},
		_process: async function() {
			this._busy = true;
			const taskDetails = this._tasks.shift();
			if (typeof(taskDetails) === "undefined") {
				return;
			}
			const task: AnyFunction = taskDetails.task;
			const args: any[] = (typeof(taskDetails.args) === "undefined") ? [] : taskDetails.args;
			const context: any = (typeof(taskDetails.context) === "undefined") ? null : taskDetails.context;
			let status: TaskResultStatus = TaskResultStatus.SUCCESS;
			let error: any = null, result: any = null;
			try {
				result = await Promise.resolve(task.apply(context, args || []));
			} catch(err) {
				error = err;
				if (typeof(taskDetails.onTaskEnd) !== "function") {
					console.error(error);
				}
				status = TaskResultStatus.ERROR;
			} finally {
				this._onFinish();
				if (typeof(taskDetails.onTaskEnd) === "function") {
					taskDetails.onTaskEnd({ result, status, error });
				}
			}
		},
		_onFinish: function() {
			this._busy = false;
			if (this._tasks.length) {
				this._process();
			}
		}
	};
	for (const k in queue) {
		const key = k as keyof Pick<Queue, "_process" | "_onFinish" | "add" | "asyncAdd">;
		if (typeof(queue[key]) === "function") {
			// @ts-expect-error Compiler is freaking out because of a simple bind
			queue[key] = queue[key].bind(queue);
		}
	}
	return queue;
}
