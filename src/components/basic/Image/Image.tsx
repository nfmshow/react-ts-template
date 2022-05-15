import React, { FunctionComponent, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { StateTree } from "@redux/initialState";
import Spinner, { SpinnerProps } from "@components/basic/Spinner";

const LoadingStatus = {
	LOADING: "LOADING",
	ERROR: "ERROR",
	SUCCESS: "SUCCESS"
} as const;

export const ScaleType = {
	WINDOW_WIDTH: "WINDOW_WIDTH",
	WINDOW_HEIGHT: "WINDOW_HEIGHT"
} as const;

type ScaleType = typeof ScaleType[keyof typeof ScaleType];
type LoadingStatus = typeof LoadingStatus[keyof typeof LoadingStatus];

interface ScaledDimension {
	scaleWith: ScaleType;
	factor: number;
}

type Dimension = string | ScaledDimension;

export interface ImageExtProps {
	width: Dimension;
	height: Dimension;
	src: string;
	spinnerScale?: number;
	twccBorderYSpinner?: string;
	dmtwccBorderYSpinner?: string;
	className?: string;
	classNameSuccess?: string;
	classNameLoading?: string;
	classNameError?: string;
	alt?: string;
}

interface ImageReduxProps {
	windowWidth: number;
	windowHeight: number;
}

function mapStateToProps(state: StateTree): ImageReduxProps {
	const { misc: { windowWidth, windowHeight } } = state;
	return {
		windowWidth: (typeof(windowWidth) === "undefined") ? 0 : windowWidth,
		windowHeight: (typeof(windowHeight) === "undefined") ? 0 : windowHeight
	};
}

const connector = connect(mapStateToProps);

type ImageProps = ConnectedProps<typeof connector> & ImageExtProps;

const Image: FunctionComponent<ImageProps> = function(props: ImageProps) {
	const [ status, setStatus ] = useState<LoadingStatus>(LoadingStatus.LOADING);
	function onSuccess(): void {
		setStatus(LoadingStatus.SUCCESS);
	}
	function onError(): void {
		setStatus(LoadingStatus.ERROR);
	}
	const { windowWidth, windowHeight, src } = props;
	const width: string = (typeof(props.width) === "string") ? props.width : (
		(props.width.scaleWith === ScaleType.WINDOW_WIDTH) ? String(props.width.factor*windowWidth): String(props.width.factor*windowHeight)
	);
	const height: string = (typeof(props.height) === "string") ? props.height : (
		(props.height.scaleWith === ScaleType.WINDOW_WIDTH) ? String(props.height.factor*windowWidth): String(props.height.factor*windowHeight)
	);
	const containerStyle: Record<string, string> = {
		width, 
		height,
		position: "relative"
	};
	const alt: string = (typeof(props.alt) === "undefined") ? "" : props.alt;
	let className: string = (typeof(props.className) === "undefined") ? "" : props.className;
	const spinnerScale: number = (typeof(props.spinnerScale) === "undefined") ? 1 : props.spinnerScale;
	const spinnerProps: SpinnerProps = { scale: spinnerScale };
	if (typeof(props.twccBorderYSpinner) !== "undefined") {
		spinnerProps.twccBorderY = props.twccBorderYSpinner;
	}
	if (typeof(props.dmtwccBorderYSpinner) !== "undefined") {
		spinnerProps.dmtwccBorderY = props.dmtwccBorderYSpinner;
	}
	if ((status === LoadingStatus.SUCCESS) && (typeof(props.classNameLoading) !== "undefined")) {
		className += props.classNameLoading;
	}
	if ((status === LoadingStatus.ERROR) && (typeof(props.classNameError) !== "undefined")) {
		className += props.classNameError;
	}
	if ((status === LoadingStatus.LOADING) && (typeof(props.classNameLoading) !== "undefined")) {
		className += props.classNameLoading;
	}
	const imageStyle: Record<string, string> = {
		width: "100%", 
		height: "100%",
		visibility: (status === LoadingStatus.SUCCESS) ? "visible" : "hidden"
	};
	return (
		<div className={className} style={containerStyle}>
			{(status !== LoadingStatus.SUCCESS) ? (
				<div className="absolute flex flex-row justify-center items-center w-full h-full">
					<Spinner { ...spinnerProps } />
				</div>
			) : (<></>)}
			<img src={src} alt={alt} style={imageStyle} 
				onLoad={onSuccess} onError={onError}
			/>
		</div>
	);
};

export default connector(Image);
