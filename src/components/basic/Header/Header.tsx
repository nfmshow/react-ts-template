import React, { FunctionComponent } from "react";
import { connect, ConnectedProps } from "react-redux";
import { StateTree } from "@redux/initialState";
import { WindowSize } from "@utils/getWindowSize";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";

export interface HeaderExtProps {
	
}

interface HeaderReduxProps extends WindowSize {}

function mapStateToProps(state: StateTree): HeaderReduxProps {
	const { misc: { windowWidth, windowHeight, mobileView } } = state;
	return {
		windowWidth: (typeof(windowWidth) === "undefined") ? 0 : windowWidth,
		windowHeight: (typeof(windowHeight) === "undefined") ? 0 : windowHeight,
		mobileView: (typeof(mobileView) === "undefined") ? true : mobileView
	};
}

const connector = connect(mapStateToProps);

type HeaderProps = ConnectedProps<typeof connector> & HeaderExtProps;

const Header: FunctionComponent<HeaderProps> = function(props: HeaderProps) {
	const { mobileView } = props;
	return mobileView ? <HeaderMobile { ...props } /> : <HeaderDesktop { ...props } />;
}; 

export default connector(Header);
