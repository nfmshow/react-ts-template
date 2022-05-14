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
import { PAGE_ANIM_DURATION } from "@constants/index";

interface RouterBodyExtProps {
	
}

interface RouterBodyReduxProps {
	animDirection: string;
	animEnabled: boolean;
}

function mapStateToProps(state: StateTree): RouterBodyReduxProps {
	const { misc: { pageAnimDirection: animDirection, pageAnimEnabled: animEnabled } } = state;
	return {
		animDirection: (typeof(animDirection) === "undefined") ? initialMiscData.pageAnimDirection : animDirection,
		animEnabled: (typeof(animEnabled) === "undefined") ? initialMiscData.pageAnimEnabled : animEnabled
	};
}

const connector = connect(mapStateToProps);

type RouterBodyProps = ConnectedProps<typeof connector> & RouterBodyExtProps;

const RouterBody: ComponentType<RouterBodyProps> = function(props: RouterBodyProps) {
	const { animDirection, animEnabled } = props;
	const navigate = useNavigate();
	const location: Location = useLocation();
	runtimeVars.navigate = navigate;
	runtimeVars.location = location;
	const [ locationKeys, setLocationKeys ] = useState<string[]>([location.key]);
	const animatingRef = useRef<boolean>(false);
	const animKeyRef = useRef<string>(location.key);
	const prevLocationKey = usePrevious<string>(location.key);
	const prevAnimEnabled = usePrevious<boolean>(animEnabled);
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