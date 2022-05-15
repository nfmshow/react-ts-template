import React, { FunctionComponent, useState } from "react";
import Button, { ButtonExtProps } from "@components/basic/Button";
import ButtonIcon from "@components/basic/ButtonIcon";
import Image from "@components/basic/Image";
import { showModal, ChildProps, ModalVertAlign, ModalHorzAlign, ModalEnterAnim } from "@components/basic/Modal";
import {
	HH_FACTOR_MOBILE, 
	MAX_HEADER_HEIGHT 
} from "@constants/index";
import { WindowSize } from "@utils/getWindowSize";

const Nav: FunctionComponent<ChildProps> = function(props: ChildProps) {
	const { closeModal } = props;
	return (
		<div className="w-9/12 h-full bg-primary-50 px-3 py-3">
			<div className="w-full pb-3">
				<ButtonIcon icon="icon-times" 
					twccTextIcon="text-primary-900"
					twccBg="bg-transparent"
					onClick={closeModal}
					shadow={false}
					scale={1.05} 
					twccBgRipple="bg-primary-900/[.3]"
				/>
			</div>
		</div>
	);
};

export interface HeaderMobileProps extends WindowSize {}

const HeaderMobile: FunctionComponent<HeaderMobileProps> = function(props: HeaderMobileProps) {
	const { windowHeight } = props;
	const containerStyle: Record<string, string> = {
		height: `${Math.min(MAX_HEADER_HEIGHT, HH_FACTOR_MOBILE*windowHeight)}px`
	};
	const [ navIsOpen, setNavIsOpen ] = useState<boolean>(false);
	function showNav(): void {
		if (navIsOpen) {
			return;
		}
		setNavIsOpen(true);
		showModal<{}>({
			vertAlignMobile: ModalVertAlign.CENTER,
			horzAlignMobile: ModalHorzAlign.RIGHT,
			enterAnimMobile: ModalEnterAnim.SLIDE_LEFT,
			type: "CUSTOM",
			component: Nav,
			props: {},
			onClose: async function(): Promise<void> {
				setNavIsOpen(false);
			}
		});
	}
	return (
		<header className="w-full bg-primary-50 shadow-md flex flex-row justify-between items-center px-3" style={containerStyle}>
			<div className="flex grow-0">
				<Image spinnerScale={0} width={"3.03rem"} height={"1.43rem"}
					src="" className="bg-primary" alt="logo.png"
				/>
			</div>
			<div className="flex grow-0">
				<ButtonIcon icon="icon-bars" 
					twccTextIcon="text-primary-900"
					twccBg="bg-transparent"
					onClick={showNav}
					shadow={false}
					scale={1.05} 
					twccBgRipple="bg-primary-900/[.3]"
				/>
			</div>
		</header>
	);
};

export default HeaderMobile;
