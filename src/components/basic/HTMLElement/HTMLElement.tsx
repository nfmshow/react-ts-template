import React, { useRef, createElement, FunctionComponent } from "react";

type ElementProps<Tag> = Tag extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[Tag] : never;

type Values<T> = T[keyof T];

type ObtainHTMLProps<T extends Values<JSX.IntrinsicElements>> =
  T extends React.DetailedHTMLProps<infer Props, HTMLElement> ? Props : never;

type AllowedProps = Values<{
  [Tag in keyof JSX.IntrinsicElements]: {
    tagName: Tag;
  } & ObtainHTMLProps<JSX.IntrinsicElements[Tag]>;
}>;  

const Editable: FunctionComponent<AllowedProps> = function({ tagName = "div", ...props }) {
	const htmlEl = useRef(null);
	const elementProps: ElementProps<typeof tagName> = {
		...props,
		ref: htmlEl,
	};
	return createElement(tagName, elementProps);
};

export default Editable;