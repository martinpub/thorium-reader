// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as React from "react";
import * as ReactDOM from "react-dom";
import { v4 as uuidv4 } from "uuid";

import MenuButton from "./MenuButton";
import MenuContent from "./MenuContent";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IBaseProps {
    button: React.ReactElement;
    content: React.ReactElement;
    open: boolean; // Is menu open
    dir: string; // Direction of menu: right or left
    toggle: () => void;
    focusMenuButton?: (ref: React.RefObject<HTMLElement>, currentMenuId: string) => void;
    infoDialogIsOpen?: boolean;
}

// IProps may typically extend:
// RouteComponentProps
// ReturnType<typeof mapStateToProps>
// ReturnType<typeof mapDispatchToProps>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends IBaseProps {
}

interface IState {
    contentStyle: React.CSSProperties;
}

export default class Menu extends React.Component<IProps, IState> {

    private backFocusMenuButtonRef: React.RefObject<HTMLElement>;
    private contentRef: HTMLDivElement;
    private menuId: string;

    constructor(props: IProps) {
        super(props);

        this.backFocusMenuButtonRef = React.createRef<HTMLElement>();

        this.state = {
            contentStyle: {},
        };
        this.menuId = "menu-" + uuidv4();
        this.doBackFocusMenuButton = this.doBackFocusMenuButton.bind(this);
        this.setBackFocusMenuButton = this.setBackFocusMenuButton.bind(this);
    }

    public componentDidUpdate(oldProps: IProps) {
        if (this.props.open && !oldProps.open) {
            this.refreshStyle();
        }
        if (oldProps.infoDialogIsOpen === true &&
            oldProps.infoDialogIsOpen !== this.props.infoDialogIsOpen) {
            this.doBackFocusMenuButton();
        }
    }

    public render(): React.ReactElement<{}> {
        const { open, toggle, button, dir, content } = this.props;
        const contentStyle = this.state.contentStyle;
        return (
            <>
                <MenuButton
                    menuId={this.menuId}
                    open={open}
                    toggle={toggle}
                    setBackFocusMenuButton={this.setBackFocusMenuButton}
                >
                    {button}
                </MenuButton>
                { open &&
                    <MenuContent
                        id={this.menuId}
                        open={open}
                        dir={dir}
                        menuStyle={contentStyle}
                        toggle={toggle}
                        setContentRef={(ref) => { this.contentRef = ref; }}
                        doBackFocusMenuButton={this.doBackFocusMenuButton}
                    >
                        <span onClick={() => setTimeout(toggle, 1)}>
                            {content}
                        </span>
                    </MenuContent>
                }
            </>
        );
    }

    private offset(el: HTMLElement) {
        const rect = el.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const right = window.innerWidth - (rect.right + 19) - scrollLeft;
        return {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft,
            right,
        };
    }

    private refreshStyle() {
        if (!this.backFocusMenuButtonRef?.current || !this.contentRef) {
            return;
        }
        const contentStyle: React.CSSProperties = {
            position: "absolute",
        };

        // calculate vertical position of the menu
        const button = this.backFocusMenuButtonRef.current;
        const buttonRect = button.getBoundingClientRect();
        const bottomPos = window.innerHeight - buttonRect.bottom;
        const contentElement = ReactDOM.findDOMNode(this.contentRef) as HTMLElement;
        const contentHeight = contentElement.getBoundingClientRect().height;

        if (bottomPos < contentHeight) {
            contentStyle.top = Math.round(this.offset(button).top - contentHeight) + "px";
        } else {
            contentStyle.top = Math.round(this.offset(button).top + buttonRect.height) + "px";
        }

        if (this.props.dir === "right") {
            contentStyle.right = Math.round(this.offset(button).right) + "px";
        } else {
            contentStyle.left = Math.round(this.offset(button).left) + "px";
        }

        this.setState({ contentStyle });
    }

    private setBackFocusMenuButton(currentRef: React.RefObject<HTMLElement>, currentMenuId: string) {
        if (currentRef?.current && this.menuId === currentMenuId) {
            this.backFocusMenuButtonRef = currentRef;
        }
    }

    private doBackFocusMenuButton() {
        if (this.backFocusMenuButtonRef?.current) {
            this.backFocusMenuButtonRef.current.focus();
        }
    }
}
