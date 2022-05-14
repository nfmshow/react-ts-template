import React, { FunctionComponent } from "react";
import ActionModal, { ActionModalExtProps } from "./ActionModal";
import { showModal as fireModal, ChildProps, ModalOptions } from "./ModalRoot";
import randomNumber from "@utils/randomNumber";

const rootOptions = [
	"horzAlignMobile",
	"horzAlignDesktop",
	"vertAlignMobile",
	"vertAlignDesktop",
	"enterAnimMobile",
	"enterAnimDesktop",
	"onClose"
] as const;
type RootOptions = typeof rootOptions[number];

interface ShowModalParamsA extends ActionModalExtProps, Pick<ModalOptions, RootOptions> {
	type: "ACTION";
}

interface ShowModalParamsI extends Pick<ModalOptions, RootOptions> {
	type: "INFO";
}

interface ShowModalParamsC<ModalProps> extends Omit<ModalOptions, "modalId"> {
	type: "CUSTOM";
	props: ModalProps;
}

type ShowModalParams<ModalProps = {}> = ShowModalParamsA | ShowModalParamsC<ModalProps> | ShowModalParamsI;

function isActionModal(params: ShowModalParams<{}>): params is ShowModalParamsA {
	return (params.type === "ACTION");
}

function isInfoModal(params: ShowModalParams<{}>): params is ShowModalParamsI {
	return (params.type === "INFO");
}

function isCustomModal<ModalProps = {}>(params: ShowModalParams<ModalProps>): params is ShowModalParamsC<ModalProps> {
	return (params.type === "CUSTOM");
}

export default async function showModal<ModalProps = {}>(params: ShowModalParams<ModalProps>): Promise<void> {
	const modalOptions: ModalOptions = {
		modalId: randomNumber(8),
		component: () => (<></>)
	};
	if (typeof(params.horzAlignMobile) !== "undefined") {
		modalOptions.horzAlignMobile = params.horzAlignMobile;
	}
	if (typeof(params.vertAlignMobile) !== "undefined") {
		modalOptions.vertAlignMobile = params.vertAlignMobile;
	}
	if (typeof(params.horzAlignDesktop) !== "undefined") {
		modalOptions.horzAlignDesktop = params.horzAlignDesktop;
	}
	if (typeof(params.vertAlignDesktop) !== "undefined") {
		modalOptions.vertAlignDesktop = params.vertAlignDesktop;
	}
	if (typeof(params.enterAnimMobile) !== "undefined") {
		modalOptions.enterAnimMobile = params.enterAnimMobile;
	}
	if (typeof(params.enterAnimDesktop) !== "undefined") {
		modalOptions.enterAnimDesktop = params.enterAnimDesktop;
	}
	if (isActionModal(params)) {
		const props: ActionModalExtProps = {
			header: params.header,
			body: params.body
		};
		if (typeof(params.leftButtonProps) !== "undefined") {
			props.leftButtonProps = params.leftButtonProps;
		}
		if (typeof(params.rightButtonProps) !== "undefined") {
			props.rightButtonProps = params.rightButtonProps;
		}
		if (typeof(params.showCloseIcon) !== "undefined") {
			props.showCloseIcon = params.showCloseIcon;
		}
		modalOptions.component = function(rootChildProps: ChildProps) {
			return <ActionModal { ...props } { ...rootChildProps } />;
		}
	} else if (isCustomModal<ModalProps>(params)) {
		modalOptions.component = function(rootChildProps: ChildProps) {
			return <params.component { ...params.props } { ...rootChildProps } />;
		}
	} else {
		throw "Info modal type is not allowed for now.";
	}
	await fireModal(modalOptions);
}