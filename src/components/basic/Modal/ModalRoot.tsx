import React, { Component, ComponentType } from "react";
import { connect, ConnectedProps } from "react-redux";
import { StateTree } from "@redux/initialState";
import getWindowSize, { WindowSize } from "@utils/getWindowSize";
import getQueue, { Queue } from "@utils/getQueue";
import wait from "@utils/wait";
import { MODAL_ANIM_DURATION } from "@constants/index";

export const ModalEnterAnim = {
	SLIDE_LEFT: "SLIDE_LEFT",
	SLIDE_RIGHT: "SLIDE_RIGHT",
	SLIDE_UP: "SLIDE_UP",
	SLIDE_DOWN: "SLIDE_DOWN",
	OPACITY: "OPACITY",
	SCALE: "SCALE"
} as const;

export const ModalVertAlign = {
	TOP: "TOP",
	BOTTOM: "BOTTOM",
	CENTER: "CENTER"
} as const;

export const ModalHorzAlign = {
	LEFT: "LEFT",
	RIGHT: "RIGHT",
	CENTER: "CENTER"
} as const;

export type ModalEnterAnim = typeof ModalEnterAnim[keyof typeof ModalEnterAnim];
export type ModalHorzAlign = typeof ModalHorzAlign[keyof typeof ModalHorzAlign];
export type ModalVertAlign = typeof ModalVertAlign[keyof typeof ModalVertAlign];

export interface ChildProps {
	modalId: string;
	closeModal: () => Promise<void>;
}

export interface ModalOptions {
	modalId: string;
	horzAlignMobile?: ModalHorzAlign;
	horzAlignDesktop?: ModalHorzAlign;
	vertAlignMobile?: ModalVertAlign;
	vertAlignDesktop?: ModalVertAlign;
	enterAnimMobile?: ModalEnterAnim;
	enterAnimDesktop?: ModalEnterAnim;
	component: ComponentType<ChildProps>;
	onClose?: () => Promise<void>;
}

interface ModalAnimStyles {
	all: Record<string, string>;
	start: Record<string, string>;
	end: Record<string, string>;
}

function getModalAnimStyles(modalOptions: ModalOptions, windowSize: WindowSize): ModalAnimStyles {
	const { mobileView, windowWidth, windowHeight } = windowSize;
	let anim: ModalEnterAnim = ModalEnterAnim.SCALE;
	if ((typeof(modalOptions.enterAnimMobile) !== "undefined") && mobileView) {
		anim =  modalOptions.enterAnimMobile;
	}
	if ((typeof(modalOptions.enterAnimDesktop) !== "undefined") && !mobileView) {
		anim =  modalOptions.enterAnimDesktop;
	}
	if (anim === ModalEnterAnim.SLIDE_RIGHT) {
		let horzAlign: ModalHorzAlign = ModalHorzAlign.CENTER;
		if ((typeof(modalOptions.horzAlignMobile) !== "undefined") && mobileView) {
			horzAlign = modalOptions.horzAlignMobile;
		}
		if ((typeof(modalOptions.horzAlignDesktop) !== "undefined") && !mobileView) {
			horzAlign = modalOptions.horzAlignDesktop;
		}
		const distance: string = (horzAlign === ModalHorzAlign.CENTER) ? `-${Math.ceil(windowWidth/2)}px` : (
			(horzAlign === ModalHorzAlign.RIGHT) ? `-${Math.ceil(windowWidth)}px` : "-100%"
		);
		return {
			all: { transition: `transform ${MODAL_ANIM_DURATION}ms ease-in` },
			start: { transform: `translateX(${distance})` },
			end: { transform: "translateX(0)" }
		};
	}
	if (anim === ModalEnterAnim.SLIDE_LEFT) {
		let horzAlign: ModalHorzAlign = ModalHorzAlign.CENTER;
		if ((typeof(modalOptions.horzAlignMobile) !== "undefined") && mobileView) {
			horzAlign = modalOptions.horzAlignMobile;
		}
		if ((typeof(modalOptions.horzAlignDesktop) !== "undefined") && !mobileView) {
			horzAlign = modalOptions.horzAlignDesktop;
		}
		const distance: string = (horzAlign === ModalHorzAlign.CENTER) ? `${Math.ceil(windowWidth/2)}px` : (
			(horzAlign === ModalHorzAlign.LEFT) ? `${Math.ceil(windowWidth)}px` : "100%"
		);
		return {
			all: { transition: `transform ${MODAL_ANIM_DURATION}ms ease-in` },
			start: { transform: `translateX(${distance})` },
			end: { transform: "translateX(0)" }
		};
	}
	if (anim === ModalEnterAnim.SLIDE_UP) {
		let vertAlign: ModalVertAlign = ModalVertAlign.CENTER;
		if ((typeof(modalOptions.vertAlignMobile) !== "undefined") && mobileView) {
			vertAlign = modalOptions.vertAlignMobile;
		}
		if ((typeof(modalOptions.vertAlignDesktop) !== "undefined") && !mobileView) {
			vertAlign = modalOptions.vertAlignDesktop;
		}
		const distance: string = (vertAlign === ModalVertAlign.CENTER) ? `${Math.ceil(windowHeight/2)}px` : (
			(vertAlign === ModalVertAlign.TOP) ? `${Math.ceil(windowHeight)}px` : "100%"
		);
		return {
			all: { transition: `transform ${MODAL_ANIM_DURATION}ms ease-in` },
			start: { transform: `translateY(${distance})` },
			end: { transform: "translateY(0)" }
		};
	}
	if (anim === ModalEnterAnim.SLIDE_DOWN) {
		let vertAlign: ModalVertAlign = ModalVertAlign.CENTER;
		if ((typeof(modalOptions.vertAlignMobile) !== "undefined") && mobileView) {
			vertAlign = modalOptions.vertAlignMobile;
		}
		if ((typeof(modalOptions.vertAlignDesktop) !== "undefined") && !mobileView) {
			vertAlign = modalOptions.vertAlignDesktop;
		}
		const distance: string = (vertAlign === ModalVertAlign.CENTER) ? `-${Math.ceil(windowHeight/2)}px` : (
			(vertAlign === ModalVertAlign.BOTTOM) ? `-${Math.ceil(windowHeight)}px` : "-100%"
		);
		return {
			all: { transition: `transform ${MODAL_ANIM_DURATION}ms ease-in` },
			start: { transform: `translateY(${distance})` },
			end: { transform: "translateY(0)" }
		};
	}
	if (anim === ModalEnterAnim.OPACITY) {
		return {
			all: { transition: `opacity ${MODAL_ANIM_DURATION}ms ease-in` },
			start: { opacity: "0" },
			end: { opacity: "1" }
		};
	}
	return {
		all: { transition: `transform ${MODAL_ANIM_DURATION}ms ease-in` },
		start: { transform: "scale(0)" },
		end: { transform: "scale(1)" }
	};
}

function getBaseContainerClasses(modalOptions: ModalOptions, mobileView: boolean): string {
	let horzAlign: ModalHorzAlign = ModalHorzAlign.CENTER;
	let vertAlign: ModalVertAlign = ModalVertAlign.CENTER;
	if (mobileView) {
		if (typeof(modalOptions.horzAlignMobile) !== "undefined") {
			horzAlign = modalOptions.horzAlignMobile;
		}
		if (typeof(modalOptions.vertAlignMobile) !== "undefined") {
			vertAlign = modalOptions.vertAlignMobile;
		}
	} else {
		if (typeof(modalOptions.horzAlignDesktop) !== "undefined") {
			horzAlign = modalOptions.horzAlignDesktop;
		}
		if (typeof(modalOptions.vertAlignDesktop) !== "undefined") {
			vertAlign = modalOptions.vertAlignDesktop;
		}
	}
	let classes = "w-full h-full flex flex-row";
	if (horzAlign === ModalHorzAlign.CENTER) {
		classes += " justify-center";
	}
	if (horzAlign === ModalHorzAlign.RIGHT) {
		classes += " justify-end";
	}
	if (horzAlign === ModalHorzAlign.LEFT) {
		classes += " justify-start";
	}
	if (vertAlign === ModalVertAlign.TOP) {
		classes += " items-start";
	}
	if (vertAlign === ModalVertAlign.BOTTOM) {
		classes += " items-end";
	}
	if (vertAlign === ModalVertAlign.CENTER) {
		classes += " items-center";
	}
	return classes;
}

interface ExtRef {
	showModal?: ((options: ModalOptions) => Promise<void>);
}

const extRef: ExtRef = {};

export async function showModal(options: ModalOptions) {
	// eslint-disable-next-line no-constant-condition
	while(true) {
		if (typeof(extRef.showModal) !== "undefined") {
			break;
		}
		await wait(75);
	}
	return extRef.showModal!(options);
}

interface ModalRootExtProps {
	
}

interface ModalRootReduxProps {
	windowWidth: number;
	windowHeight: number;
	mobileView: boolean;
}

function mapStateToProps(state: StateTree): ModalRootReduxProps {
	const { misc: { windowWidth, windowHeight, mobileView } } = state;
	return {
		windowWidth: (typeof(windowWidth) === "undefined") ? 0 : windowWidth,
		windowHeight: (typeof(windowHeight) === "undefined") ? 0 : windowHeight,
		mobileView: (typeof(mobileView) === "undefined") ? true : mobileView
	};
}

const connector = connect(mapStateToProps);

type ModalRootProps = ConnectedProps<typeof connector> & ModalRootExtProps;

interface Modal extends ModalOptions {
	animStyles: ModalAnimStyles;
	animState: "END" | "START";
	containerClasses: string;
}

interface ModalRootState {
	modals: Modal[],
	bgOpacity: string;
}

class ModalRoot extends Component<ModalRootProps, ModalRootState> {
	constructor(props: ModalRootProps) {
		super(props);
		extRef.showModal = this.showModal;
	}
	
	queue: Queue = getQueue();
	
	state: ModalRootState = {
		modals: [],
		bgOpacity: "0"
	};
	
	closeModal: ((modalId: string) => Promise<void>) = (modalId) => {
		return this.queue.asyncAdd({
			task: function(this: ModalRoot) {
				return this.closeModalTask(modalId);
			},
			context: this
		});
	};
	
	closeModalTask: ((modalId: string) => Promise<void>) = async (modalId) => {
		await new Promise<void>((resolve) => {
			this.setState((prevState: ModalRootState): ModalRootState => {
				const modals: Modal[] = prevState.modals.map((modal: Modal): Modal => {
					if (modal.modalId !== modalId) {
						return modal;
					}
					return { ...modal, animState: "START" };
				});
				return {
					...prevState, 
					bgOpacity: (prevState.modals.length <= 1) ? "0" : prevState.bgOpacity,
					modals
				};
			}, resolve);
		});
		await wait(MODAL_ANIM_DURATION);
		await new Promise<void>((resolve) => {
			this.setState((prevState: ModalRootState): ModalRootState => {
				const modals: Modal[] = prevState.modals.filter((modal: Modal): boolean => {
					if (modal.modalId === modalId) {
						try {
							if (typeof(modal.onClose) !== "undefined") {
								modal.onClose();
							}
						} catch(err) {
							console.error(err);
						}
						return false;
					}
					return true;
				});
				return { ...prevState, modals };
			}, resolve);
		});
	};
	
	showModal: ((options: ModalOptions) => Promise<void>) = (options) => {
		return this.queue.asyncAdd({
			task: function(this: ModalRoot) {
				return this.showModalTask(options);
			},
			context: this
		});
	};
	
	showModalTask: ((options: ModalOptions) => Promise<void>) = async (options) => {
		const { modalId } = options;
		const windowSize: WindowSize = getWindowSize();
		await new Promise<void>((resolve) => {
			this.setState((prevState: ModalRootState): ModalRootState => {
				const newModal: Modal = {
					...options,
					animStyles: getModalAnimStyles(options, windowSize),
					animState: "START",
					containerClasses: getBaseContainerClasses(options, windowSize.mobileView)
				};
				return {
					...prevState,
					bgOpacity: "0.6",
					modals: [ ...prevState.modals, newModal ]
				};
			}, resolve);
		});
		await wait(1);
		await new Promise<void>((resolve) => {
			this.setState((prevState: ModalRootState): ModalRootState => {
				const modals: Modal[] = prevState.modals.map((modal: Modal): Modal => {
					if (modal.modalId !== modalId) {
						return modal;
					}
					return { ...modal, animState: "END" };
				});
				return { ...prevState, modals };
			}, resolve);
		});
		await wait(MODAL_ANIM_DURATION);
	};
	
	render() {
		const { bgOpacity, modals } = this.state;
		const { windowWidth, windowHeight } = this.props;
		const containerStyle: Record<string, string> = {
			width: `${modals.length ? windowWidth : 0}px` ,
			height: `${modals.length ? windowHeight : 0}px`,
			overflow: "hidden",
			display: "relative"
		};
		const bgStyle: Record<string, string> = {
			opacity: bgOpacity,
			transition: `opacity ${MODAL_ANIM_DURATION}ms ease-in`
		};
		return (
			<div style={containerStyle}>
				<div style={bgStyle} className="w-full h-full absolute bg-black"></div>
				{modals.map((modal: Modal, index: number) => {
					const { modalId, containerClasses, component: ModalComponent, animStyles, animState } = modal;
					const wrapperStyle: Record<string, string> = {
						display: (index === (modals.length - 1)) ? "flex" : "none",
						...animStyles.all,
						...((animState === "END") ? animStyles.end : animStyles.start)
					};
					return (
						<div style={wrapperStyle} key={modalId} className={containerClasses}>
							<ModalComponent modalId={modalId} 
								closeModal={() => this.closeModal(modalId)}
							/>
						</div>
					);
				})}
			</div>
		);
	}
}

export default connector(ModalRoot);