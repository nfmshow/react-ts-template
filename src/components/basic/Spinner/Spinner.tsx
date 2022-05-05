import React, { FunctionComponent } from "react";
//import { COLOR_PRIMARY } from "@constants/index";

export interface SpinnerProps {
	scale?: number;
	twccBorderY?: string;
	dmtwccBorderY?: string;
}

const Spinner: FunctionComponent<SpinnerProps> = function(props: SpinnerProps) {
	const scale: number = (typeof(props.scale) === "undefined") ? 1 : props.scale;
	const twccBorderY: string = (typeof(props.twccBorderY) === "undefined") ? "border-y-primary" : props.twccBorderY;
	const dmtwccBorderY: string = (typeof(props.dmtwccBorderY) === "undefined") ? "border-y-zinc-50" : props.dmtwccBorderY;
	const style: string = `display: block; border-width: ${scale*3}px; width: ${scale*32}px; height: ${scale*32}px; margin: ${scale*3}px; display: block; animation: spinner-1 1.2s linear infinite;`;
	const elemSize: number = scale*3*2 + scale*32 + scale*3*2;
	return (
		<span style={`display: inline-block; width: ${elemSize}px; height: ${elemSize}px;`}>
			<span className={`${twccBorderY} border-x-transparent dark:${dmtwccBorderY} rounded-full`} style={style}></span>
		</span>
	);
};

export default Spinner;
