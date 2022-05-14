import React, { FunctionComponent } from "react";
import Button, { ButtonExtProps } from "@components/basic/Button";
import ButtonIcon from "@components/basic/ButtonIcon";
import { ChildProps, ModalOptions } from "./ModalRoot";

interface ContentHTML {
	html: string;
}

export interface ActionModalExtProps {
	leftButtonProps?: ButtonExtProps;
	rightButtonProps?: ButtonExtProps;
	header: string | ContentHTML;
	body: string | ContentHTML;
	showCloseIcon?: boolean;
}

interface ActionModalProps extends ChildProps, ActionModalExtProps {}

const defaultLeftButtonProps: ButtonExtProps = {
	text: "No",
	twAnimHover: "hover:animate-bounce-small"
};

const defaultRightButtonProps: ButtonExtProps = {
	text: "Yes",
	twAnimHover: "hover:animate-bounce-small"
};

const ActionModal: FunctionComponent<ActionModalProps> = function(props: ActionModalProps) {
	const { closeModal, header, body } = props;
	const showCloseIcon = (typeof(props.showCloseIcon) === "undefined") ? true : props.showCloseIcon;
	const leftButtonProps: ButtonExtProps = {
		...defaultLeftButtonProps,
		...((typeof(props.leftButtonProps) === "undefined") ? {} : props.leftButtonProps)
	};
	const rightButtonProps: ButtonExtProps = {
		...defaultRightButtonProps,
		...((typeof(props.rightButtonProps) === "undefined") ? {} : props.rightButtonProps)
	};
	const lbOnClick = ((typeof(props.leftButtonProps) !== "undefined") && (typeof(props.leftButtonProps.onClick) !== "undefined")) ? props.leftButtonProps.onClick : (() => {});
	const rbOnClick = ((typeof(props.rightButtonProps) !== "undefined") && (typeof(props.rightButtonProps.onClick) !== "undefined")) ? props.rightButtonProps.onClick : (() => {});
	leftButtonProps.onClick = function(e) {
		return Promise.resolve(lbOnClick(e))
		.then(closeModal)
		.catch(console.error);
	};
	rightButtonProps.onClick = function(e) {
		return Promise.resolve(rbOnClick(e))
		.then(closeModal)
		.catch(console.error);
	};
	return (
		<div className="flex flex-col bg-primary-50 rounded">
			<div className="w-100 relative flex flex-row justify-end items-center px-3 pt-2 pb-3">
				{(typeof(header) === "string") ? (
					<p className="grow translate-x-1/2 right-1/2 absolute text-center font-bold text-lg truncate">
						{header}
					</p>
				) : (
					<div className="grow absolute" dangerouslySetInnerHTML={{ __html: header.html }}>
					</div>
				)}
				<div className="grow-0 justify-self-end inline-flex">
					{showCloseIcon ? (
						<ButtonIcon twccTextIcon="text-slate-900" twccBg="bg-transparent" 
							twccBgRipple="bg-slate-900/[.3]" shadow={false} 
							onClick={closeModal} icon="icon-times"
						/>
					) : (<></>)}
				</div>
			</div>
			<div className="w-100 px-3 pb-3">
				{(typeof(body) === "string") ? (
					<span className="text-base">
						{body}
					</span>
				) : (
					<div className="w-100" dangerouslySetInnerHTML={{ __html: body.html }}>
					</div>
				)}
			</div>
			<div className="w-100 flex justify-evenly px-3 pt-4 pb-6">
				<Button { ...leftButtonProps } />
				<Button { ...rightButtonProps } />
			</div>
		</div>
	);
};

export default ActionModal;
