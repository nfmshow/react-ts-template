import React, { FunctionComponent, MouseEvent } from "react";
import { onLinkClick, Link } from "@utils/links";
import useCustomRef from "@utils/useCustomRef";
import Ripple, { RippleRef } from "@components/basic/Ripple";
import AnyElement from "@components/basic/HTMLElement";

export interface ButtonIconProps {
	twccBorder?: string;
	dmtwccBorder?: string;
	twccBg?: string;
	dmtwccBg?: string;
	twccShadow?: string;
	twccBgRipple?: string;
	twccTextIcon?: string;
	dmtwccTextIcon?: string;
	rippleSizeScale?: number;
	iconSizeScale?: number;
	iconFontFamily?: string;
	borderSizeScale?: number;
	borderRadiusScale?: number;
	element?: "button" | "a";
	link?: Link;
	shadow?: boolean;
	icon: string;
	scale?: number;
	width?: string;
	height?: string;
	paddingLeftScale?: number;
	paddingRightScale?: number;
	paddingBottomScale?: number;
	paddingTopScale?: number;
	twAnimHover?: string;
	twContentHorzAlign?: "justify-center" | "justify-start" | "justify-end";
	onClick?: ((...args: any[]) => any);
	onHover?: ((...args: any[]) => any);
}

const ButtonIcon: FunctionComponent<ButtonIconProps> = function(props: ButtonIconProps) {
	const rippleRef = useCustomRef<RippleRef>({});
	function showRipple(e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>): void {
		rippleRef.current!.show!(e);
	}
	function onClick(e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>): void {
		showRipple(e);
		if (typeof(props.link) !== "undefined") {
			onLinkClick(props.link);
			return;
		}
		if (typeof(props.onClick) !== "undefined") {
			props.onClick(e);
			return;
		}
	}
	const { icon } = props;
	const twccBorder: string = (typeof(props.twccBorder) === "undefined") ? "border-transparent" : props.twccBorder;
	const dmtwccBorder: string = (typeof(props.dmtwccBorder) === "undefined") ? "border-transparent" : props.dmtwccBorder;
	const twccBg: string = (typeof(props.twccBg) === "undefined") ? "bg-primary-900" : props.twccBg;
	const dmtwccBg: string = (typeof(props.dmtwccBg) === "undefined") ? "bg-primary-900" : props.dmtwccBg;
	const twccBgRipple: string = (typeof(props.twccBgRipple) === "undefined") ? "bg-gray-50/[.3]" : props.twccBgRipple;
	const twccTextIcon: string = (typeof(props.twccTextIcon) === "undefined") ? "text-white" : props.twccTextIcon;
	const dmtwccTextIcon: string = (typeof(props.dmtwccTextIcon) === "undefined") ? "text-black" : props.dmtwccTextIcon;
	const rippleSizeScale: number = (typeof(props.rippleSizeScale) === "undefined") ? 1 : props.rippleSizeScale;
	const iconSizeScale: number = (typeof(props.iconSizeScale) === "undefined") ? 1 : props.iconSizeScale;
	const borderSizeScale: number = (typeof(props.borderSizeScale) === "undefined") ? 0 : props.borderSizeScale;
	const borderRadiusScale: number = (typeof(props.borderRadiusScale) === "undefined") ? 1 : props.borderRadiusScale;
	const scale: number = (typeof(props.scale) === "undefined") ? 1 : props.scale;
	const element = (typeof(props.element) === "undefined") ? "button" : props.element;
	const paddingLeftScale: number = (typeof(props.paddingLeftScale) === "undefined") ? 1 : props.paddingLeftScale;
	const paddingRightScale: number = (typeof(props.paddingRightScale) === "undefined") ? 1 : props.paddingRightScale;
	const paddingTopScale: number = (typeof(props.paddingTopScale) === "undefined") ? 1 : props.paddingTopScale;
	const paddingBottomScale: number = (typeof(props.paddingBottomScale) === "undefined") ? 1 : props.paddingBottomScale;
	const twccShadow: string = (typeof(props.twccShadow) === "undefined") ? "shadow-lg" : props.twccShadow;
	const iconFontFamily: string = (typeof(props.iconFontFamily) === "undefined") ? "Icomoon" : props.iconFontFamily;
	const shadow: boolean = (typeof(props.shadow) === "undefined") ? true : props.shadow;
	const twAnimHover: string = (typeof(props.twAnimHover) === "undefined") ? "" : props.twAnimHover;
	const twContentHorzAlign: string = (typeof(props.twContentHorzAlign) === "undefined") ? "justify-center" : props.twContentHorzAlign;
	const width: string = (typeof(props.width) === "undefined") ? `${2.5*iconSizeScale*1}rem` : props.width;
	const height: string = (typeof(props.height) === "undefined") ? `${2.5*iconSizeScale*1}rem` : props.height;
	const outerContainerStyle: Record<string, string> = {
		width,
		height,
		borderWidth: `${borderSizeScale*0.125}rem`,
		borderRadius: `${borderRadiusScale*1000}px`
	};
	const outerContainerClass: string = `${shadow ? twccShadow : ""} ${twccBg} dark:${dmtwccBg} ${twccBorder} dark:${dmtwccBorder} ${twAnimHover} hover:outline-none focus:outline-none overflow-hidden`;
	const rippleWidth: string = (width === "auto") ? "auto" : "100%";
	const rippleHeight: string = (height === "auto") ? "auto" : "100%";
	const innerContainerWidth: string = (width === "auto") ? "auto" : "100%";
	const innerContainerHeight: string = (height === "auto") ? "auto" : "100%"; 
	const innerContainerClass: string = `${(width === "auto") ? "inline-flex" : "flex"} flex-row ${twContentHorzAlign} items-center`;
	const paddingY: number = 0.4;
	const paddingX: number = 0.4;
	const innerContainerStyle: Record<string, string> = {
		paddingLeft: `${scale*paddingLeftScale*paddingX}rem`,
		paddingRight: `${scale*paddingRightScale*paddingX}rem`,
		paddingTop: `${scale*paddingTopScale*paddingY}rem`,
		paddingBottom: `${scale*paddingBottomScale*paddingY}rem`,
		width: innerContainerWidth,
		height: innerContainerHeight
	};
	const iconClass: string = `${twccTextIcon} dark:${dmtwccTextIcon} text-center ${icon}`;
	const iconStyle: Record<string, string> = {
		fontFamily: iconFontFamily,
		fontSize: `${scale*iconSizeScale*1}rem`
	};
	return (
		<AnyElement tagName={element} onClick={onClick} className={outerContainerClass}
			style={outerContainerStyle} onMouseEnter={showRipple} onMouseMove={showRipple}
		>
			<Ripple customRef={rippleRef} width={rippleWidth} height={rippleHeight}
				scale={rippleSizeScale} twccBg={twccBgRipple} element="span"
			>
				<span className={innerContainerClass} style={innerContainerStyle}>
					<i className={iconClass} style={iconStyle}></i>
				</span>
			</Ripple>
		</AnyElement>
	);
};

export default ButtonIcon;
