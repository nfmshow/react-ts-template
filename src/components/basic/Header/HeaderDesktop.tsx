import React, { FunctionComponent, useState } from "react";
import Button, { ButtonExtProps } from "@components/basic/Button";
import ButtonIcon from "@components/basic/ButtonIcon";
import Image from "@components/basic/Image";
import {
	HH_FACTOR_DESKTOP, 
	MAX_HEADER_HEIGHT 
} from "@constants/index";
import { WindowSize } from "@utils/getWindowSize";

export interface HeaderDesktopProps extends WindowSize {}

const HeaderDesktop: FunctionComponent<HeaderDesktopProps> = function(props: HeaderDesktopProps) {
	const { windowHeight } = props;
	const containerStyle: Record<string, string> = {
		height: `${Math.min(MAX_HEADER_HEIGHT, HH_FACTOR_DESKTOP*windowHeight)}px`
	};
	return (
		<header className="w-full bg-primary-50 shadow-md flex flex-row justify-between items-center px-3" style={containerStyle}>
			<div className="flex grow-0">
				<Image spinnerScale={0} width={"5.13rem"} height={"2.435rem"}
					src="" className="bg-primary" alt="logo.png"
				/>
			</div>
			<div className="flex flex-row grow-0">
				<div className="pr-3">
					<Button text="Sign Up" 
						twccText="text-primary-900"
						twccBg="bg-transparent"
						twccBorder="border-primary-900"
						borderRadiusScale={2}
						borderSizeScale={1}
						shadow={false}
						scale={1.05} 
						twccBgRipple="bg-primary-900/[.3]"
					/>
				</div>
			</div>
		</header>
	);
};

export default HeaderDesktop;
