import React, { FunctionComponent, ComponentType, useEffect, useState, useRef } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { connect, ConnectedProps } from "react-redux";
import { unstable_HistoryRouter as HistoryRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import RTLoader from "@components/basic/RTLoader";
import { pages, Page }  from "./routes";
import runtimeVars, { Location } from "@utils/runtimeVars";
import history from "@utils/history";
import usePrevious from "@utils/usePrevious";
import { initialMiscData, StateTree } from "@redux/initialState";
import {
	PAGE_ANIM_DURATION,
	HH_FACTOR_DESKTOP,
	HH_FACTOR_MOBILE,
	MAX_HEADER_HEIGHT
} from "@constants/index";

interface RouterBodyExtProps {
	
}

interface RouterBodyReduxProps {
	animDirection: string;
	animEnabled: boolean;
	windowHeight: number;
	mobileView: boolean;
}

function mapStateToProps(state: StateTree): RouterBodyReduxProps {
	const { misc: { pageAnimDirection: animDirection, pageAnimEnabled: animEnabled, windowHeight, mobileView } } = state;
	return {
		animDirection: (typeof(animDirection) === "undefined") ? initialMiscData.pageAnimDirection : animDirection,
		animEnabled: (typeof(animEnabled) === "undefined") ? initialMiscData.pageAnimEnabled : animEnabled,
		windowHeight: (typeof(windowHeight) === "undefined") ? 0 : windowHeight,
		mobileView: (typeof(mobileView) === "undefined") ? true : mobileView
	};
}

const connector = connect(mapStateToProps);

type RouterBodyProps = ConnectedProps<typeof connector> & RouterBodyExtProps;

const RouterBody: ComponentType<RouterBodyProps> = function(props: RouterBodyProps) {
	const { animDirection, animEnabled, mobileView, windowHeight } = props;
	const navigate = useNavigate();
	const location: Location = useLocation();
	runtimeVars.navigate = navigate;
	runtimeVars.location = location;
	const [ locationKeys, setLocationKeys ] = useState<string[]>([location.key]);
	const animatingRef = useRef<boolean>(false);
	const animKeyRef = useRef<string>(location.key);
	const prevLocationKey = usePrevious<string>(location.key);
	const prevAnimEnabled = usePrevious<boolean>(animEnabled);
	const paddingTop: number = Math.min(MAX_HEADER_HEIGHT, mobileView ? (HH_FACTOR_MOBILE*windowHeight) : (HH_FACTOR_DESKTOP*windowHeight));
	const height: number = windowHeight - paddingTop;
	const containerStyle: Record<string, string> = {
		paddingTop: `${paddingTop}px`,
		height: `${height}px`
	};
	if ((prevAnimEnabled !== animEnabled) && !animEnabled) {
		animatingRef.current = false;
	}
	if (prevLocationKey !== location.key) {
		if (animEnabled && !animatingRef.current) {
			animatingRef.current = true;
			animKeyRef.current = location.key;
		}
	}
	useEffect(function() {
		if ((locationKeys.length === 1) && (locationKeys[0] === location.key)) {
			return;
		}
		if (locationKeys.length >= 20) {
			setLocationKeys([
				location.key,
				...locationKeys.slice(0, locationKeys.length - 1),
			]);
		} else {
			setLocationKeys([location.key].concat(locationKeys));
		}
	}, [location.key]);
	return (
		<div className="w-full" style={containerStyle}>
			<TransitionGroup component={null}>
				<CSSTransition /* @ts-expect-error Type 'Element' is not assignable to type 'TransitionChildren' */ key={animKeyRef.current} classNames={`move-${(animDirection === "FORWARD") ? "ltr" : "rtl"}`} timeout={PAGE_ANIM_DURATION}>
					<Routes location={location}>
						{pages.map((page: Page) => {
							return (
								<Route path={page.path} key={page.pageId}
									element={
										<RTLoader config={{
											loaderId: page.pageId,
											task: page.loaderTask
										}}
										key={page.pageId}
										/>
									}
								/>
							);
						})}
					</Routes>
				</CSSTransition>
			</TransitionGroup>
		</div>
	);
};

const RCRouterBody = connector(RouterBody);

const Router: FunctionComponent = function() {
	return (
		<HistoryRouter history={history}>
			<RCRouterBody />
		</HistoryRouter>
	);
};

export default Router;