import React, { FunctionComponent, useEffect } from "react";
import Button from "@components/basic/Button";
import ButtonIcon from "@components/basic/ButtonIcon";
import Image from "@components/basic/Image";
import { PageIds } from "@pages/index";
import { showModal, ModalHorzAlign, ModalVertAlign, ModalEnterAnim } from "@components/basic/Modal";

/*
"horzAlignMobile",
	"horzAlignDesktop",
	"vertAlignMobile",
	"vertAlignDesktop",
	"enterAnimMobile",
	"enterAnimDesktop",
*/

function fireModal(): void {
	showModal({
		horzAlignMobile: ModalHorzAlign.CENTER,
		enterAnimMobile: ModalEnterAnim.SLIDE_UP,
		type: "ACTION",
		header: "Test header",
		body: "Are you sure you want to do this stuff?"
	});
}

const Test: FunctionComponent = function() {
	return (
		<div className="w-full h-full p-8 overflow-y-auto">
			<div className="p-2">
				<Button icon="icon-home-alt" twAnimHover={"hover:animate-bounce-small"} 
					scale={1} text={"To Home"} link={PageIds.HOME}
				/>
			</div>
			<div className="p-2">
				<Button twAnimHover={"hover:animate-bounce-small"} 
					scale={1} text={"Action Modal"} onClick={fireModal}
				/>
			</div>
			<div className="p-2">
				<ButtonIcon scale={1} twccTextIcon="text-primary-900" twccBg="bg-transparent" 
					twccBgRipple="bg-primary-900/[.3]" shadow={false} icon={"icon-pencil"} 
					twAnimHover={"hover:animate-bounce"} 
					link={PageIds.HOME}
				/>
			</div>
			<div style={{ height: "1500px", width: "200px" }}></div>
		</div>
	);
};

export default Test;
