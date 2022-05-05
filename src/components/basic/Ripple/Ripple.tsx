import React, { FunctionComponent, ReactNode, MouseEvent, useState } from "react";
import { RefType } from "@utils/useCustomRef";
import AnyElement from "@components/basic/HTMLElement";

export interface RippleRef {
	show?: ((e: MouseEvent<HTMLElement>) => void);
}

export interface RippleProps {
	children?: ReactNode;
	twccBg?: string;
	element: "span" | "div";
	scale?: number;
	width?: string;
	height?: string;
	customRef?: RefType<RippleRef>;
}

interface Coords {
	x: number;
	y: number;
}

const Ripple: FunctionComponent<RippleProps> = function(props: RippleProps, ref) {
	const { element, children } = props;
	const [ coords, setCoords ] = useState<Coords>({ x: -1, y: -1 });
	const twccBg: string = (typeof(props.twccBg) === "undefined") ? "bg-gray-200" : props.twccBg;
	const rippleSizeScale: number = (typeof(props.scale) === "undefined") ? 1 : props.scale;
	const rippleStyle: Record<string, string> = {
		width: `${rippleSizeScale*20}px`,
		height: `${rippleSizeScale*20}px`,
		opacity: "1",
		animation: "0.9s ease 1 forwards ripple-effect"
	};
	const containerStyle: Record<string, string> = {
		width: (typeof(props.width) === "undefined") ? "auto" : props.width,
		height: (typeof(props.height) === "undefined") ? "auto" : props.height
	};
	const contentStyle: Record<string, string> = {
		width: (containerStyle.width === "auto") ? "auto" : "100%",
		height: (containerStyle.height === "auto") ? "auto" : "100%"
	};
	function show(e: MouseEvent<HTMLElement>): void {
		/* @ts-expect-error Specific element type should be supplied */
		const rect = e.target.getBoundingClientRect!();
		setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
		setTimeout(function(): void {
			setCoords({ x: -1, y: -1 });
		}, 350);
	}
	if (typeof(props.customRef) !== "undefined") {
		props.customRef.current = { show };
	}
	return (
		<AnyElement tagName={element} style={containerStyle} className="relative cursor-pointer overflow-hidden">
			{((coords.x !== -1) && (coords.y !== -1)) ? (
				<span style={rippleStyle} className={`block absolute rounded-full ${twccBg}`}></span>
			) : (
				<></>
			)}
			<AnyElement tagName={element} style={contentStyle} className="relative z-10">
				{children}
			</AnyElement>
		</AnyElement>
	);
}

export default Ripple;
