import React, { FunctionComponent, ReactNode, MouseEvent } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RSButton, StateTree } from "@redux/initialState";
import { onLinkClick, Link } from "@utils/links";
import useCustomRef from "@utils/useCustomRef";
import Ripple, { RippleRef } from "@components/basic/Ripple";
import AnyElement from "@components/basic/HTMLElement";
import Spinner from "@components/basic/Spinner";

export interface ButtonExtProps {
	twccBorder?: string;
	dmtwccBorder?: string;
	twccBg?: string;
	dmtwccBg?: string;
	twccText?: string;
	dmtwccText?: string;
	twccTextIcon?: string;
	dmtwccTextIcon?: string;
	twccBorderYSpinner?: string;
	dmtwccBorderYSpinner?: string;
	twccShadow?: string;
	twccBgRipple?: string;
	spinnerScale?: number;
	rippleSizeScale?: number;
	textSizeScale?: number;
	textFontFamily?: string;
	iconSizeScale?: number;
	iconFontFamily?: string;
	borderSizeScale?: number;
	element?: "button" | "a";
	link?: Link;
	width?: string;
	height?: string;
	shadow?: boolean;
	text: string;
	icon?: string;
	textRight?: boolean;
	paddingLeftScale?: number;
	paddingRightScale?: number;
	paddingBottomScale?: number;
	paddingTopScale?: number;
	buttonId?: string;
	twContentHorzAlign?: "justify-center" | "justify-start" | "justify-end";
	onClick?: ((...args: any[]) => any);
	onHover?: ((...args: any[]) => any);
};

function mapStateToProps(state: StateTree, ownProps: ButtonExtProps): RSButton {
	const defaultProps: RSButton = {
		loading: false
	};
	const props = (typeof(ownProps.buttonId) === "undefined") ? defaultProps : (state.buttons[ownProps.buttonId] || defaultProps);
	return props;
}

const connector = connect(mapStateToProps);

type ButtonProps = ConnectedProps<typeof connector> & ButtonExtProps;

const Button: FunctionComponent<ButtonProps> = function(props: ButtonProps) {
	const rippleRef = useCustomRef<RippleRef>({});
	function onClick(e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>): void {
		rippleRef.current!.show!(e);
		if (typeof(props.link) !== "undefined") {
			onLinkClick(props.link);
			return;
		}
		if (typeof(props.onClick) !== "undefined") {
			onClick(e);
			return;
		}
	}
	const { text, loading } = props;
	const twccBorder: string = (typeof(props.twccBorder) === "undefined") ? "border-transparent" : props.twccBorder;
	const dmtwccBorder: string = (typeof(props.dmtwccBorder) === "undefined") ? "border-transparent" : props.dmtwccBorder;
	const twccBg: string = (typeof(props.twccBg) === "undefined") ? "bg-primary" : props.twccBg;
	const dmtwccBg: string = (typeof(props.dmtwccBg) === "undefined") ? "bg-primary" : props.dmtwccBg;
	const twccText: string = (typeof(props.twccText) === "undefined") ? "text-white" : props.twccText;
	const dmtwccText: string = (typeof(props.dmtwccText) === "undefined") ? "text-white" : props.dmtwccText;
	const twccTextIcon: string = (typeof(props.twccTextIcon) === "undefined") ? "text-white" : props.twccTextIcon;
	const dmtwccTextIcon: string = (typeof(props.dmtwccTextIcon) === "undefined") ? "text-white" : props.dmtwccTextIcon;
	const twccBorderYSpinner: string = (typeof(props.twccBorderYSpinner) === "undefined") ? "border-y-white" : props.twccBorderYSpinner;
	const dmtwccBorderYSpinner: string = (typeof(props.dmtwccBorderYSpinner) === "undefined") ? "border-y-white" : props.dmtwccBorderYSpinner;
	const twccBgRipple: string = (typeof(props.twccBgRipple) === "undefined") ? "bg-gray-200" : props.twccBgRipple;
	const spinnerScale: number = (typeof(props.spinnerScale) === "undefined") ? 1 : props.spinnerScale;
	const rippleSizeScale: number = (typeof(props.rippleSizeScale) === "undefined") ? 1 : props.rippleSizeScale;
	const textSizeScale: number = (typeof(props.textSizeScale) === "undefined") ? 1 : props.textSizeScale;
	const iconSizeScale: number = (typeof(props.iconSizeScale) === "undefined") ? 1 : props.iconSizeScale;
	const borderSizeScale: number = (typeof(props.borderSizeScale) === "undefined") ? 0 : props.borderSizeScale;
	const paddingLeftScale: number = (typeof(props.paddingLeftScale) === "undefined") ? 1 : props.paddingLeftScale;
	const paddingRightScale: number = (typeof(props.paddingRightScale) === "undefined") ? 1 : props.paddingRightScale;
	const paddingTopScale: number = (typeof(props.paddingTopScale) === "undefined") ? 1 : props.paddingTopScale;
	const paddingBottomScale: number = (typeof(props.paddingBottomScale) === "undefined") ? 1 : props.paddingBottomScale;
	const element = (typeof(props.element) === "undefined") ? "button" : props.element;
	const width: string = (typeof(props.width) === "undefined") ? "auto" : props.width;
	const height: string = (typeof(props.height) === "undefined") ? "auto" : props.height;
	const twccShadow: string = (typeof(props.twccShadow) === "undefined") ? "shadow" : props.twccShadow;
	const textRight: boolean = (typeof(props.textRight) === "undefined") ? false : props.textRight;
	const iconFontFamily: string = (typeof(props.iconFontFamily) === "undefined") ? "Icomoon" : props.iconFontFamily;
	const shadow: boolean = (typeof(props.shadow) === "undefined") ? true : props.shadow;
	const twContentHorzAlign: string = (typeof(props.twContentHorzAlign) === "undefined") ? "justify-center" : props.twContentHorzAlign;
	const outerContainerStyle: Record<string, string> = {
		width,
		height,
		borderWidth: `${borderSizeScale*2}px`
	};
	const outerContainerClass: string = `${shadow ? twccShadow : ""} ${twccBg} dark:${dmtwccBg} ${twccBorder} dark:${dmtwccBorder}`;
	const rippleWidth: string = (width === "auto") ? "auto" : "100%";
	const rippleHeight: string = (height === "auto") ? "auto" : "100%";
	const innerContainerWidth: string = (width === "auto") ? "auto" : "100%";
	const innerContainerHeight: string = (height === "auto") ? "auto" : "100%";
	const innerContainerClass: string = `${(width === "auto") ? "inline-flex" : "flex"} flex-row ${twContentHorzAlign} items-center`;
	const paddingY: number = 10;
	const paddingX: number = 16;
	const innerContainerStyle: Record<string, string> = {
		paddingLeft: `${paddingLeftScale*paddingX}px`,
		paddingRight: `${paddingRightScale*paddingX}px`,
		paddingTop: `${paddingTopScale*paddingY}px`,
		paddingBottom: `${paddingBottomScale*paddingY}px`
	};
	const iconClass: string = `${twccTextIcon} dark:${dmtwccTextIcon} text-center ${textRight ? "pl-2" : "pr-2"}`;
	const iconStyle: Record<string, string> = {
		fontFamily: iconFontFamily,
		fontSize: `${iconSizeScale*16}px`
	};
	const textClass: string = `${twccText} dark:${dmtwccText} text-center`;
	const textStyle: Record<string, string> = {
		fontSize: `${textSizeScale*16}px`
	};
	if (props.textFontFamily) {
		textStyle.fontFamily = props.textFontFamily;
	}
	return (
		<AnyElement tagName={element} onClick={onClick} className={outerContainerClass}
			style={outerContainerStyle}
		>
			<Ripple customRef={rippleRef} width={rippleWidth} height={rippleHeight}
				scale={rippleSizeScale} twccBg={twccBgRipple} element="span"
			>
				<span className={innerContainerClass} style={innerContainerStyle}>
					{!textRight ? (<span className={textClass} style={textStyle}>{text}</span>) : (<></>)}
					{loading ? (
						<Spinner scale={spinnerScale} 
							twccBorderY={twccBorderYSpinner}
							dmtwccBorderY={dmtwccBorderYSpinner}
						/>
					) : (
						props.icon ? (<span className={iconClass} style={iconStyle}>{props.icon}</span>) : (<></>)
					)}
					{textRight ? (<span className={textClass} style={textStyle}>{text}</span>) : (<></>)}
				</span>
			</Ripple>
		</AnyElement>
	);
}

export default connector(Button);
