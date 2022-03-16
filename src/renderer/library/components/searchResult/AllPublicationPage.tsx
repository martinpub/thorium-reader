// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import "regenerator-runtime/runtime"; // for react-table (useAsyncDebounce()) see: https://github.com/TanStack/react-table/issues/2071#issuecomment-679999096
import { Location } from "history";
import SVG from "readium-desktop/renderer/common/components/SVG";
// import * as SearchIcon from "readium-desktop/renderer/assets/icons/baseline-search-24px-grey.svg";
import * as magnifyingGlass from "readium-desktop/renderer/assets/icons/magnifying_glass.svg";
import * as ArrowRightIcon from "readium-desktop/renderer/assets/icons/baseline-play_arrow-24px.svg"; // baseline-arrow_forward_ios-24px -- arrow
// import * as ArrowLeftIcon from "readium-desktop/renderer/assets/icons/baseline-arrow_left_ios-24px.svg";
import * as ArrowLastIcon from "readium-desktop/renderer/assets/icons/baseline-skip_next-24px.svg";
import * as ArrowFirstIcon from "readium-desktop/renderer/assets/icons/baseline-skip_previous-24px.svg";
import { matchSorter } from "match-sorter";
import { readerActions } from "readium-desktop/common/redux/actions";
import { DialogTypeName } from "readium-desktop/common/models/dialog";
import * as dialogActions from "readium-desktop/common/redux/actions/dialog";
import { TDispatch } from "readium-desktop/typings/redux";
import {
    FilterTypes,
    Row,
    TableInstance,
    TableOptions,
    TableState,
    UseFiltersColumnProps,
    UseFiltersInstanceProps,
    UseFiltersOptions,
    UseGlobalFiltersInstanceProps,
    UseGlobalFiltersOptions,
    UseGlobalFiltersState,
    UsePaginationInstanceProps,
    UsePaginationOptions,
    UsePaginationState,
    UseSortByColumnProps,
    UseSortByInstanceProps,
    UseSortByOptions,
    UseSortByState,
    UseTableColumnProps,
    ColumnWithLooseAccessor,
    UseFiltersColumnOptions,
    UseTableColumnOptions,
    UseSortByColumnOptions,
    UseGlobalFiltersColumnOptions,
    IdType,
} from "react-table";
import { Column, useTable, useFilters, useSortBy, usePagination, useGlobalFilter, useAsyncDebounce } from "react-table";
import { formatTime } from "readium-desktop/common/utils/time";
import * as DOMPurify from "dompurify";
import * as moment from "moment";
import { AvailableLanguages, I18nTyped, Translator } from "readium-desktop/common/services/translator";
import * as React from "react";
import { connect } from "react-redux";
import { PublicationView } from "readium-desktop/common/views/publication";
import {
    TranslatorProps, withTranslator,
} from "readium-desktop/renderer/common/components/hoc/translator";
import { apiAction } from "readium-desktop/renderer/library/apiAction";
import { apiSubscribe } from "readium-desktop/renderer/library/apiSubscribe";
import BreadCrumb from "readium-desktop/renderer/library/components/layout/BreadCrumb";
import LibraryLayout from "readium-desktop/renderer/library/components/layout/LibraryLayout";
import { ILibraryRootState } from "readium-desktop/renderer/library/redux/states";
import { Unsubscribe } from "redux";

import Header from "../catalog/Header";

import { DisplayType, IRouterLocationState } from "readium-desktop/renderer/library/routing";
import { keyboardShortcutsMatch } from "readium-desktop/common/keyboard";
import {
    ensureKeyboardListenerIsInstalled, registerKeyboardListener, unregisterKeyboardListener,
} from "readium-desktop/renderer/common/keyboard";

// import {
//     formatContributorToString,
// } from "readium-desktop/renderer/common/logics/formatContributor";

// import { Link } from "react-router-dom";

// import { GridView } from "readium-desktop/renderer/library/components/utils/GridView";
// import { ListView } from "readium-desktop/renderer/library/components/utils/ListView";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IBaseProps extends TranslatorProps {
}
// IProps may typically extend:
// RouteComponentProps
// ReturnType<typeof mapStateToProps>
// ReturnType<typeof mapDispatchToProps>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends IBaseProps, ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
}

interface IState {
    publicationViews: PublicationView[] | undefined;
}

export class AllPublicationPage extends React.Component<IProps, IState> {
    private unsubscribe: Unsubscribe;
    private focusInputRef: React.RefObject<HTMLInputElement>;

    constructor(props: IProps) {
        super(props);

        this.onKeyboardFocusSearch = this.onKeyboardFocusSearch.bind(this);
        this.focusInputRef = React.createRef<HTMLInputElement>();

        this.state = {
            publicationViews: undefined,
        };
    }

    public componentDidMount() {
        ensureKeyboardListenerIsInstalled();
        this.registerAllKeyboardListeners();

        this.unsubscribe = apiSubscribe([
            "publication/importFromFs",
            "publication/delete",
            "publication/importFromLink",
            // "catalog/addEntry",
            "publication/updateTags",
        ], () => {
            apiAction("publication/findAll")
                .then((publicationViews) => {
                    this.setState({publicationViews});
                    setTimeout(() => {
                        this.onKeyboardFocusSearch();
                    }, 400);
                })
                .catch((error) => console.error("Error to fetch api publication/findAll", error));
        });
    }

    public componentWillUnmount() {
        this.unregisterAllKeyboardListeners();

        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    public async componentDidUpdate(oldProps: IProps) {
        if (!keyboardShortcutsMatch(oldProps.keyboardShortcuts, this.props.keyboardShortcuts)) {
            this.unregisterAllKeyboardListeners();
            this.registerAllKeyboardListeners();
        }
    }

    public render(): React.ReactElement<{}> {
        const displayType = (this.props.location?.state && (this.props.location.state as IRouterLocationState).displayType) || DisplayType.Grid;

        const { __ } = this.props;
        const title = __("catalog.allBooks");

        const secondaryHeader = <Header />;
        const breadCrumb = <BreadCrumb breadcrumb={[{ name: __("catalog.myBooks"), path: "/library" }, { name: title }]}/>;

        return (
            <LibraryLayout
                title={`${__("catalog.myBooks")} / ${title}`}
                secondaryHeader={secondaryHeader}
                breadCrumb={breadCrumb}
            >
                {
                    this.state.publicationViews ?
                        <TableView
                            location={this.props.location}
                            displayType={displayType}
                            __={__}
                            translator={this.props.translator}
                            publicationViews={this.state.publicationViews}
                            displayPublicationInfo={this.props.displayPublicationInfo}
                            openReader={this.props.openReader}
                            focusInputRef={this.focusInputRef}
                        />
                        // (displayType === DisplayType.Grid ?
                        //     <GridView normalOrOpdsPublicationViews={this.state.publicationViews} /> :
                        //     <ListView normalOrOpdsPublicationViews={this.state.publicationViews} />)
                    : <></>
                }
            </LibraryLayout>
        );
    }

    private registerAllKeyboardListeners() {
        registerKeyboardListener(
            true, // listen for key up (not key down)
            this.props.keyboardShortcuts.FocusSearch,
            this.onKeyboardFocusSearch);
    }

    private unregisterAllKeyboardListeners() {
        unregisterKeyboardListener(this.onKeyboardFocusSearch);
    }

    private onKeyboardFocusSearch = () => {
        if (!this.focusInputRef?.current) {
            return;
        }
        this.focusInputRef.current.focus();
        // this.focusInputRef.current.select();
        this.focusInputRef.current.setSelectionRange(0, this.focusInputRef.current.value.length);
    };
}

const mapStateToProps = (state: ILibraryRootState) => ({
    location: state.router.location,
    keyboardShortcuts: state.keyboard.shortcuts,
});

const mapDispatchToProps = (dispatch: TDispatch, _props: IBaseProps) => {
    return {
        displayPublicationInfo: (publicationViewIdentifier: string) => {
            dispatch(dialogActions.openRequest.build(DialogTypeName.PublicationInfoLib,
                {
                    publicationIdentifier: publicationViewIdentifier,
                },
            ));
        },
        openReader: (publicationViewIdentifier: string) => {
            dispatch(readerActions.openRequest.build(publicationViewIdentifier));
        },
    };
};

const commonCellStyles =  (props: ITableCellProps_Column & ITableCellProps_GenericCell): React.CSSProperties => {
    return {
        // minHeight: props.displayType === DisplayType.Grid ? "150px" : "80px",
        maxHeight: props.displayType === DisplayType.Grid ? "150px" : "80px",

        // minWidth: props.displayType === DisplayType.Grid ? "150px" : "100px",
        // maxWidth: props.displayType === DisplayType.Grid ? "150px" : "50px",

        padding: "0.4em",
        overflowY: "auto",
        textAlign: "center",
        userSelect: "text",
    };
};

interface ITableCellProps_GlobalFilter {
    __: I18nTyped;
    translator: Translator;
    displayType: DisplayType;

    preGlobalFilteredRows: Row<IColumns>[];
    globalFilteredRows: Row<IColumns>[];
    globalFilter: string;
    setGlobalFilter: (filterValue: string) => void;
    focusInputRef: React.RefObject<HTMLInputElement>;
}
const CellGlobalFilter: React.FC<ITableCellProps_GlobalFilter> = (props) => {

    const [value, setValue] = React.useState(props.globalFilter);

    const onChange = useAsyncDebounce((value) => {
        props.setGlobalFilter(value || undefined);
    }, 500);

    return (
        <div
            style={{
                // border: "1px solid blue",
                textAlign: "left",
            }}>

            <label
                id="globalSearchLabel"
                htmlFor="globalSearchInput"
                style={{
                    fontSize: "90%",
                    fontWeight: "bold",
                }}>
                {`${props.__("header.searchPlaceholder")}`}
            </label>
            <div
                    aria-live="polite"
                    style={{
                        // border: "1px solid red",
                        marginLeft: "0.4em",
                        display: "inline-block",
                        fontSize: "90%",
                        // width: "4em",
                        overflow: "visible",
                        whiteSpace: "nowrap",
                    }}>
                {props.globalFilteredRows.length !== props.preGlobalFilteredRows.length ? ` (${props.globalFilteredRows.length} / ${props.preGlobalFilteredRows.length})` : ` (${props.preGlobalFilteredRows.length})`}
            </div>
            <input
                id="globalSearchInput"
                aria-labelledby="globalSearchLabel"
                ref={props.focusInputRef}
                type="search"
                value={value || ""}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`${props.__("header.searchTitle")}`}
                style={{
                    border: "1px solid gray",
                    borderRadius: "4px",
                    margin: "0",
                    marginLeft: "0.4em",
                    width: "10em",
                    padding: "0.2em",
                }}
                />
        </div>
    );
};

interface ITableCellProps_Filter {
    __: I18nTyped;
    translator: Translator;
    displayType: DisplayType;

    showColumnFilters: boolean,
}
interface ITableCellProps_Column {
    column: ColumnWithLooseAccessor<IColumns> & UseFiltersColumnProps<IColumns>,
    // {
    //     filterValue: string | undefined;
    //     preFilteredRows: string[];
    //     filteredRows: string[];
    //     setFilter: (str: string | undefined) => void;
    // };
}
const CellColumnFilter: React.FC<ITableCellProps_Filter & ITableCellProps_Column> = (props) => {

// <span
// style={{
//     fontSize: "90%",
//     fontWeight: "bold",
// }}>
// {`${props.__("header.searchPlaceholder")}`}
// </span>

// <div
// aria-live="polite"
// style={{
//     // border: "1px solid red",
//     marginLeft: "0.4em",
//     display: "inline-block",
//     fontSize: "90%",
//     // width: "4em",
//     overflow: "visible",
//     whiteSpace: "nowrap",
// }}>
// {props.column.filteredRows.length !== props.column.preFilteredRows.length ? ` (${props.column.filteredRows.length} / ${props.column.preFilteredRows.length})` : ` (${props.column.preFilteredRows.length})`}
// </div>
    return props.showColumnFilters ?
    <>
    <input
        type="search"
        value={props.column.filterValue || ""}
        onChange={(e) => {
            props.column.setFilter(e.target.value || undefined);
        }}
        aria-label={`${props.__("header.searchPlaceholder")} (${props.column.Header})`}
        placeholder={`${props.__("header.searchPlaceholder")} (${props.column.Header})`}
        style={{
            border: "1px solid gray",
            borderRadius: "4px",
            margin: "0",
            width: "100%",
            padding: "0.2em",
            backgroundColor: "white",
        }}
    />
    </>
    : <></>;
};

interface ITableCellProps_GenericCell extends ITableCellProps_Common {
    setShowColumnFilters: (show: boolean) => void;
}

interface IColumnValue_Cover extends IColumnValue_BaseString {

    title: string,
    publicationViewIdentifier: string,
};
interface ITableCellProps_Value_Cover {
    value: IColumnValue_Cover;
}
const CellCoverImage: React.FC<ITableCellProps_Column & ITableCellProps_GenericCell & ITableCellProps_Value_Cover> = (props) => {
    return (<div style={{
        padding: "0",
        margin: "0",
        textAlign: "center",
    }}>
        <a
            style={{
                cursor: "pointer",
            }}
            tabIndex={0}
            onClick={(e) => {
                e.preventDefault();

                props.displayPublicationInfo(props.value.publicationViewIdentifier);
                // props.openReader(props.value.publicationViewIdentifier);
            }}
            onKeyPress={
                (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();

                        props.displayPublicationInfo(props.value.publicationViewIdentifier);
                        // props.openReader(props.value.publicationViewIdentifier);
                    }
                }
            }
            title={`${props.value.title} (${props.__("catalog.bookInfo")})`}
        >
        <img
            src={
                // NOTE! empty string doesn't work with `??` operator, must use ternary!
                props.value.label
                ?
                props.value.label
                :
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAGUUlEQVR4Xu3UAQ0AIAwDQfCvBx9zBAk2/uag16X7zNzlCBBICmwDkOxdaAJfwAB4BAJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJGAA/QCAsYADC5YtOwAD4AQJhAQMQLl90AgbADxAICxiAcPmiEzAAfoBAWMAAhMsXnYAB8AMEwgIGIFy+6AQMgB8gEBYwAOHyRSdgAPwAgbCAAQiXLzoBA+AHCIQFDEC4fNEJPOMbVS78Q2ATAAAAAElFTkSuQmCC"
            }
            alt={""}
            role="presentation"
            style={{

            objectFit: "contain",
            width: "100%",
            height: "100%",

            // minHeight: props.displayType === DisplayType.Grid ? "150px" : "80px",
            // maxHeight: props.displayType === DisplayType.Grid ? "150px" : "50px",

            // minWidth: props.displayType === DisplayType.Grid ? "150px" : "100px",
            // maxWidth: props.displayType === DisplayType.Grid ? "150px" : "50px",
        }} />
        </a>
    </div>);
};

interface IColumnValue_Langs extends IColumnValue_BaseString {
    langs: string[],
};
interface ITableCellProps_Value_Langs {
    value: IColumnValue_Langs;
}
const CellLangs: React.FC<ITableCellProps_Column & ITableCellProps_GenericCell & ITableCellProps_Value_Langs> = (props) => {

    const link = (t: string) => {
        return <a
            title={`${t} (${props.__("header.searchPlaceholder")})`}
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === "Enter") {
                e.preventDefault();
                props.column.setFilter(t);
                props.setShowColumnFilters(true);
            }}}

            onClick={(e) => {
                e.preventDefault();
                props.column.setFilter(t);
                props.setShowColumnFilters(true);
            }}
            style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                padding: "2px 6px",
                fontSize: "1rem",
                // backgroundColor: "#e7f1fb",
                // borderRadius: "5px",
                // border: "1px solid var(--color-tertiary)",
                // color: "var(--color-tertiary)",
                cursor: "pointer",
                // textDecoration: "none",
                textDecoration: "underline",
                textDecorationColor: "var(--color-tertiary)",
                textDecorationSkip: "ink",
                marginRight: "6px",
                marginBottom: "6px",
        }}>{t}</a>;
    };

    // props.value.label === props.value.tags.join(", ")

    const flexStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        flexWrap: "wrap",
        paddingTop: "0.2em",
    };

    return props.value.langs?.length ?
    (
    props.value.langs.length === 1 ? (
        <div style={{...flexStyle}}>
        {
        link(props.value.langs[0])
        }
        </div>
    ) : (
        <ul style={{
            listStyleType: "none",
            margin: "0",
            padding: "0",
            ...flexStyle,
        }}>
        {
        props.value.langs.map((t, i) => {
            return <li
                key={`k${i}`}
                style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "0",
                    padding: "0",
                }}
            >{link(t)}</li>;
        })
        }
        </ul>
    ))
    : <></>;
};

interface IColumnValue_Publishers extends IColumnValue_BaseString {
    publishers: string[],
};
interface ITableCellProps_Value_Publishers {
    value: IColumnValue_Publishers;
}
const CellPublishers: React.FC<ITableCellProps_Column & ITableCellProps_GenericCell & ITableCellProps_Value_Publishers> = (props) => {

    const link = (t: string) => {
        return <a
            title={`${t} (${props.__("header.searchPlaceholder")})`}
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === "Enter") {
                e.preventDefault();
                props.column.setFilter(t);
                props.setShowColumnFilters(true);
            }}}

            onClick={(e) => {
                e.preventDefault();
                props.column.setFilter(t);
                props.setShowColumnFilters(true);
            }}
            style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                padding: "2px 6px",
                fontSize: "1rem",
                // backgroundColor: "#e7f1fb",
                // borderRadius: "5px",
                // border: "1px solid var(--color-tertiary)",
                // color: "var(--color-tertiary)",
                cursor: "pointer",
                // textDecoration: "none",
                textDecoration: "underline",
                textDecorationColor: "var(--color-tertiary)",
                textDecorationSkip: "ink",
                marginRight: "6px",
                marginBottom: "6px",
        }}>{t}</a>;
    };

    // props.value.label === props.value.tags.join(", ")

    const flexStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        flexWrap: "wrap",
        paddingTop: "0.2em",
    };

    return props.value.publishers?.length ?
    (
    props.value.publishers.length === 1 ? (
        <div style={{...flexStyle}}>
        {
        link(props.value.publishers[0])
        }
        </div>
    ) : (
        <ul style={{
            listStyleType: "none",
            margin: "0",
            padding: "0",
            ...flexStyle,
        }}>
        {
        props.value.publishers.map((t, i) => {
            return <li
                key={`k${i}`}
                style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "0",
                    padding: "0",
                }}
            >{link(t)}</li>;
        })
        }
        </ul>
    ))
    : <></>;
};

interface IColumnValue_Authors extends IColumnValue_BaseString {
    authors: string[],
};
interface ITableCellProps_Value_Authors {
    value: IColumnValue_Authors;
}
const CellAuthors: React.FC<ITableCellProps_Column & ITableCellProps_GenericCell & ITableCellProps_Value_Authors> = (props) => {

    const link = (t: string) => {
        return <a
            title={`${t} (${props.__("header.searchPlaceholder")})`}
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === "Enter") {
                e.preventDefault();
                props.column.setFilter(t);
                props.setShowColumnFilters(true);
            }}}

            onClick={(e) => {
                e.preventDefault();
                props.column.setFilter(t);
                props.setShowColumnFilters(true);
            }}
            style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                padding: "2px 6px",
                fontSize: "1rem",
                // backgroundColor: "#e7f1fb",
                // borderRadius: "5px",
                // border: "1px solid var(--color-tertiary)",
                // color: "var(--color-tertiary)",
                cursor: "pointer",
                // textDecoration: "none",
                textDecoration: "underline",
                textDecorationColor: "var(--color-tertiary)",
                textDecorationSkip: "ink",
                marginRight: "6px",
                marginBottom: "6px",
        }}>{t}</a>;
    };

    // props.value.label === props.value.tags.join(", ")

    const flexStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        flexWrap: "wrap",
        paddingTop: "0.2em",
    };

    return props.value.authors?.length ?
    (
    props.value.authors.length === 1 ? (
        <div style={{...flexStyle}}>
        {
        link(props.value.authors[0])
        }
        </div>
    ) : (
        <ul style={{
            listStyleType: "none",
            margin: "0",
            padding: "0",
            ...flexStyle,
        }}>
        {
        props.value.authors.map((t, i) => {
            return <li
                key={`k${i}`}
                style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "0",
                    padding: "0",
                }}
            >{link(t)}</li>;
        })
        }
        </ul>
    ))
    : <></>;
};

interface IColumnValue_Tags extends IColumnValue_BaseString {
    tags: string[],
};
interface ITableCellProps_Value_Tags {
    value: IColumnValue_Tags;
}
const CellTags: React.FC<ITableCellProps_Column & ITableCellProps_GenericCell & ITableCellProps_Value_Tags> = (props) => {

    // TagSearchResult.tsx
    // publication.ts findByTag()

    const link = (t: string) => {
        return <a
            title={`${t} (${props.__("header.searchPlaceholder")})`}
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === "Enter") {
                e.preventDefault();
                props.column.setFilter(t);
                props.setShowColumnFilters(true);
            }}}

            onClick={(e) => {
                e.preventDefault();
                props.column.setFilter(t);
                props.setShowColumnFilters(true);
            }}
            style={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: "#e7f1fb",
            padding: "2px 6px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid var(--color-tertiary)",
            color: "var(--color-tertiary)",
            cursor: "pointer",
            textDecoration: "none",
            marginRight: "6px",
            marginBottom: "6px",
        }}>{t}</a>;
    };

    // props.value.label === props.value.tags.join(", ")

    const flexStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        flexWrap: "wrap",
        paddingTop: "0.2em",
    };

    return props.value.tags?.length ?
    (
    props.value.tags.length === 1 ? (
        <div style={{...flexStyle}}>
        {
        link(props.value.tags[0])
        }
        </div>
    ) : (
        <ul style={{
            listStyleType: "none",
            margin: "0",
            padding: "0",
            ...flexStyle,
        }}>
        {
        props.value.tags.map((t, i) => {
            return <li
                key={`k${i}`}
                style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "0",
                    padding: "0",
                }}
            >{link(t)}</li>;
        })
        }
        </ul>
    ))
    : <></>;
};

const CellDescription: React.FC<ITableCellProps_Column & ITableCellProps_GenericCell & ITableCellProps_StringValue> = (props) => {
    return (<div style={{
        ...commonCellStyles(props),
        paddingBottom: "0",
        // marginBottom: "0.4em",

        // minHeight: props.displayType === DisplayType.Grid ? "150px" : "80px",
        // maxHeight: props.displayType === DisplayType.Grid ? "150px" : "100px",

        // minWidth: props.displayType === DisplayType.Grid ? "150px" : "100px",
        // maxWidth: props.displayType === DisplayType.Grid ? "150px" : "50px",

        // textAlign: props.displayType === DisplayType.Grid ? "justify" : "start",
        textAlign: "start",
    }} dangerouslySetInnerHTML={{__html: props.value}} />);
};

interface IColumnValue_Title extends IColumnValue_BaseString {

    title: string,
    publicationViewIdentifier: string,
};
interface ITableCellProps_Value_Title {
    value: IColumnValue_Title;
}
const CellTitle: React.FC<ITableCellProps_Column & ITableCellProps_GenericCell & ITableCellProps_Value_Title> = (props) => {
    return (<div style={{
        ...commonCellStyles(props),
        fontWeight: "bold",
    }}><a
        style={{ cursor: "pointer", paddingTop: "0.4em", paddingBottom: "0.4em" }}
        tabIndex={0}
        onClick={(e) => {
            e.preventDefault();

            props.displayPublicationInfo(props.value.publicationViewIdentifier);
            // props.openReader(props.value.publicationViewIdentifier);
        }}
        onKeyPress={
            (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();

                    props.displayPublicationInfo(props.value.publicationViewIdentifier);
                    // props.openReader(props.value.publicationViewIdentifier);
                }
            }
        }
        title={`${props.value.title} (${props.__("catalog.bookInfo")})`}
    >
        {props.value.label}
        </a>
    </div>);
};

const TableCell: React.FC<ITableCellProps_Column & ITableCellProps_GenericCell & ITableCellProps_StringValue> = (props) => {
    return (<div style={{
        ...commonCellStyles(props),
    }}>
        {props.value}
    </div>);
};

interface IColumnValue_BaseString {
    label: string,
};

interface ITableCellProps_StringValue {
    value: string;
}

interface IColumns {
    colCover: IColumnValue_Cover,
    colTitle: IColumnValue_Title;
    colAuthors: IColumnValue_Authors;
    colPublishers: IColumnValue_Publishers;
    colLanguages: IColumnValue_Langs;
    colPublishedDate: string;
    colDescription: string;
    colLCP: string;
    colTags: IColumnValue_Tags;
    colDuration: string;
    // colIdentifier: string;
    // colPublicationType: string;
    // colProgression: string;
}

// https://gist.github.com/ggascoigne/646e14c9d54258e40588a13aabf0102d
// https://github.com/TanStack/react-table/issues/3064
// https://github.com/TanStack/react-table/issues/2912
// etc. :(
type MyTableInstance<T extends object> =
    TableInstance<T> & // UseTableInstanceProps
    UseGlobalFiltersInstanceProps<T> &
    UseFiltersInstanceProps<T> &
    UseSortByInstanceProps<T> &
    UsePaginationInstanceProps<T> & {
        state: TableState<T> & UsePaginationState<T> & UseGlobalFiltersState<T> & UseSortByState<T>;
    };

interface ITableCellProps_Common {
    __: I18nTyped;
    translator: Translator;
    displayType: DisplayType;

    displayPublicationInfo: ReturnType<typeof mapDispatchToProps>["displayPublicationInfo"];
    openReader: ReturnType<typeof mapDispatchToProps>["openReader"];
}
interface ITableCellProps_TableView {
    publicationViews: PublicationView[];
    focusInputRef: React.RefObject<HTMLInputElement>;
    location: Location;
}
export const TableView: React.FC<ITableCellProps_TableView & ITableCellProps_Common> = (props) => {

    const [showColumnFilters, setShowColumnFilters] = React.useState(false);

    const scrollToViewRef = React.useRef(null);

    const renderProps_Filter: ITableCellProps_Filter =
    {
        __: props.__,
        translator: props.translator,
        displayType: props.displayType,

        showColumnFilters,
    };

    const renderProps_Cell: ITableCellProps_GenericCell =
    {
        __: props.__,
        translator: props.translator,
        displayType: props.displayType,

        displayPublicationInfo: props.displayPublicationInfo,
        openReader: props.openReader,

        setShowColumnFilters: (show: boolean) => {
            setShowColumnFilters(show);

            if (scrollToViewRef.current) {
                scrollToViewRef.current.scrollIntoView();
            }
        },
    };

    const tableRows = React.useMemo(() => {
        return props.publicationViews.map((publicationView) => {

            // translator.translateContentField(author)
            // const authors = publicationView.authors ? formatContributorToString(publicationView.authors, props.translator) : "";
            // const publishers = publicationView.publishers ? formatContributorToString(publicationView.publishers, props.translator) : "";

            const mom = publicationView.publishedAt ? moment(publicationView.publishedAt) : undefined;
            const publishedDate = mom ? `${mom.year()}-${mom.month().toString().padStart(2, "0")}-${mom.day().toString().padStart(2, "0")}` : ""; // .toISOString()

            const langsArray = publicationView.languages ? publicationView.languages.map((lang) => {

                // See FormatPublicationLanguage

                // Note: "pt-PT" in the i18next ResourceBundle is not captured because key match reduced to "pt"
                // Also: pt-pt vs. pt-PT case sensitivity
                // Also zh-CN (mandarin chinese)
                const l = lang.split("-")[0];

                // because dynamic label does not pass typed i18n compilation
                const translate = props.__ as (str: string) => string;

                // The backticks is not captured by the i18n scan script (automatic detection of translate("...") calls)
                let ll = translate(`languages.${l}`).replace(`languages.${l}`, lang);

                const lg = AvailableLanguages[l as keyof typeof AvailableLanguages];
                if (lg && lang == ll) {
                    ll = lg;
                }

                const note = (lang !== ll) ? ` (${lang})` : "";

                return ll + note;
            }) : undefined;

            const description = publicationView.description ? DOMPurify.sanitize(publicationView.description).replace(/font-size:/g, "font-sizexx:") : "";

            const lcp = publicationView.lcp ? "LCP" : "";

            const duration = (publicationView.duration ? formatTime(publicationView.duration) : "") + (publicationView.nbOfTracks ? ` (${props.__("publication.audio.tracks")}: ${publicationView.nbOfTracks})` : "");

            // const identifier = publicationView.workIdentifier ? publicationView.workIdentifier : "";
            // const publicationType = publicationView.RDFType ? publicationView.RDFType : "";

            // r2PublicationJson: JsonMap;
            // lastReadingLocation?: LocatorExtended;
            const cols: IColumns = {
                colCover: { // IColumnValue_Cover
                    label: publicationView.cover?.thumbnailUrl ?? publicationView.cover?.coverUrl ?? "",
                    publicationViewIdentifier: publicationView.identifier,
                    title: publicationView.title,
                },
                colTitle: { // IColumnValue_Title
                    label: publicationView.title,
                    publicationViewIdentifier: publicationView.identifier,
                    title: publicationView.title,
                },
                colAuthors: { // IColumnValue_Authors
                    label: publicationView.authors ? publicationView.authors.join(", ") : "",
                    authors: publicationView.authors,
                },
                colPublishers: { // IColumnValue_Publishers
                    label: publicationView.publishers ? publicationView.publishers.join(", ") : "",
                    publishers: publicationView.publishers,
                },
                colLanguages: { // IColumnValue_Tags
                    label: langsArray ? langsArray.join(", ") : "",
                    langs: langsArray,
                },
                colPublishedDate: publishedDate,
                colLCP: lcp,
                colTags: { // IColumnValue_Tags
                    label: publicationView.tags ? publicationView.tags.join(", ") : "",
                    tags: publicationView.tags,
                },
                colDuration: duration,
                colDescription: description,
                // colProgression: "Progression",
                // colIdentifier: identifier,
                // colPublicationType: publicationType,
            };
            return cols;
        });
    }, [props.publicationViews]);

    const sortFunction = (rowA: Row<IColumns>, rowB: Row<IColumns>, columnId: IdType<IColumns>, desc?: boolean) => {
        let res = 0;

        let v1: string = rowA.values[columnId];
        if (typeof v1 !== "string") {
            v1 = (v1 as IColumnValue_BaseString).label;
        }

        let v2: string = rowB.values[columnId];
        if (typeof v2 !== "string") {
            v2 = (v2 as IColumnValue_BaseString).label;
        }

        if (!v1) {
            res = desc ? -1 : 1;
        } else {
            if (!v2) {
                res = desc ? 1 : -1;
            } else {
                if (v1 === v2) {
                    res = 0;
                } else {
                    res = v1 < v2 ? -1 : 1;
                }
            }
        }

        return res;
        // return desc ? res : (-1 * res);
    };

    const tableColumns = React.useMemo(() => {
        const arr: (Column<IColumns> &
            UseTableColumnOptions<IColumns>  &
            UseSortByColumnOptions<IColumns>  &
            UseGlobalFiltersColumnOptions<IColumns>  &
            UseFiltersColumnOptions<IColumns>)[] = [
            {
                Header: props.__("publication.cover.img"),
                accessor: "colCover",
                Cell: CellCoverImage,
                // filter: "text", // because IColumnValue_BaseString instead of plain string
                sortType: sortFunction,
            },
            {
                Header: props.__("publication.title"),
                accessor: "colTitle",
                Cell: CellTitle,
                filter: "text", // because IColumnValue_BaseString instead of plain string
                sortType: sortFunction,
            },
            {
                Header: props.__("publication.author"),
                accessor: "colAuthors",
                Cell: CellAuthors,
                filter: "text", // because IColumnValue_BaseString instead of plain string
                sortType: sortFunction,
            },
            {
                Header: props.__("catalog.publisher"),
                accessor: "colPublishers",
                Cell: CellPublishers,
                filter: "text", // because IColumnValue_BaseString instead of plain string
                sortType: sortFunction,
            },
            {
                Header: props.__("catalog.lang"),
                accessor: "colLanguages",
                Cell: CellLangs,
                filter: "text", // because IColumnValue_BaseString instead of plain string
                sortType: sortFunction,
            },
            {
                Header: props.__("catalog.released"),
                accessor: "colPublishedDate",
                sortType: sortFunction,
            },
            {
                Header: props.__("catalog.tags"),
                accessor: "colTags",
                Cell: CellTags,
                filter: "text", // because IColumnValue_BaseString instead of plain string
                sortType: sortFunction,
            },
            {
                Header: "DRM",
                accessor: "colLCP",
                sortType: sortFunction,
            },
            {
                Header: props.__("publication.duration.title"),
                accessor: "colDuration",
                sortType: sortFunction,
            },
            {
                Header: props.__("catalog.description"),
                accessor: "colDescription",
                Cell: CellDescription,
                sortType: sortFunction,
            },
            // {
            //     Header: props.__("publication.progression.title"),
            //     accessor: "colProgression",
            // sortType: sortFunction,
            // },
            // {
            //     Header: "Identifier",
            //     accessor: "colIdentifier",
            // sortType: sortFunction,
            // },
            // {
            //     Header: "Type",
            //     accessor: "colPublicationType",
            // sortType: sortFunction,
            // },
        ];
        return arr;
    }, [props.displayType]);

    const defaultColumn = React.useMemo(
        () => ({
            Cell: TableCell,
            Filter: CellColumnFilter,
        }),
        [],
    );

    const filterTypes = React.useMemo(() => ({

            globalFilter: (rows: Row<IColumns>[], columnIds: string[], filterValue: string) => {
                const set = new Set<Row<IColumns>>();
                columnIds.forEach((columnId) => {
                    const subRes = filterTypes.text(rows, columnId, filterValue);
                    subRes.forEach((r) => {
                        set.add(r);
                    });
                });
                const res = Array.from(set);
                // console.log(`filterTypes.globalFilter ======= ${rows.length} ${JSON.stringify(columnIds)} ${typeof filterValue} ${res.length}`);
                return res;
            },
            text: (rows: Row<IColumns>[], columnId: string, filterValue: string) => {
                // const res = rows.filter((row) => {
                //     let rowValue = row.values[columnId];
                //     if (typeof rowValue !== "string") {
                //         rowValue = (rowValue as IColumnValue).label;
                //     }
                //     return rowValue
                //         ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
                //         : true; // keep (filter in, not out)
                // });
                const res = matchSorter<Row<IColumns>>(rows, filterValue, { keys: [(row) => {
                    let rowValue = row.values[columnId];
                    if (typeof rowValue !== "string") {
                        rowValue = (rowValue as IColumnValue_BaseString).label;
                    }
                    return rowValue;
                }],
                // https://github.com/kentcdodds/match-sorter#threshold-number
                threshold: matchSorter.rankings.CONTAINS});
                // console.log(`filterTypes.text ======= ${rows.length} ${columnId} ${typeof filterValue} ${res.length}`);
                return res;
            },
        }),
    []);

    // infinite render loop
    // tableInstance.setPageSize(pageSize);
    const initialState: UsePaginationState<IColumns> = {
        pageSize: 20, // props.displayType === DisplayType.List ? 20 : 10;
        pageIndex: 0,
    };
    const opts:
        TableOptions<IColumns> &
        UseFiltersOptions<IColumns> &
        UseGlobalFiltersOptions<IColumns> &
        UseSortByOptions<IColumns> &
        UsePaginationOptions<IColumns> = {

        columns: tableColumns,
        data: tableRows,
        defaultColumn,
        globalFilter: "globalFilter",
        filterTypes: filterTypes as unknown as FilterTypes<IColumns>, // because typing 'columnIds' instead of 'columnId' in FilterType<D> ?!
        initialState: initialState as TableState<IColumns>, // again, typing woes :(
    };
    const tableInstance =
        useTable<IColumns>(opts, useFilters, useGlobalFilter, useSortBy, usePagination) as MyTableInstance<IColumns>;


    // <pre>
    // <code>
    //     {JSON.stringify(
    //     {
    //         pageIndex: tableInstance.state.pageIndex,
    //         pageSize: tableInstance.state.pageSize,
    //         pageCount: tableInstance.pageCount,
    //         canNextPage: tableInstance.canNextPage,
    //         canPreviousPage: tableInstance.canPreviousPage,
    //         pageOptions: tableInstance.pageOptions,
    //     }, null, 2)}
    // </code>
    // </pre>
    // <span>
    // {tableInstance.state.pageIndex + 1} / {tableInstance.pageOptions.length}
    // </span>
    // <span>
    // {props.__("reader.navigation.goTo")}
    // <input
    //     type="number"
    //     defaultValue={tableInstance.state.pageIndex + 1}
    //     onChange={(e) => {
    //         const page = e.target.value ? Number(e.target.value) - 1 : 0;
    //         tableInstance.gotoPage(page);
    //     }}
    //     style={{ width: "100px" }}
    // />
    // </span>
    //     <select
    //     value={tableInstance.state.pageSize}
    //     onChange={e => {
    //         tableInstance.setPageSize(Number(e.target.value));
    //     }}
    // >
    //     Show
    //     {[10, 20, 30, 40, 50].map((pageSize) => (
    //         <option
    //             key={`p${pageSize}`}
    //             value={pageSize}>
    //             {pageSize}
    //         </option>
    //     ))}
    //     </select>
    return (
        <>
        <div style={{
            // border: "1px solid red",
            position: "fixed",
            // width: "calc(100% - 50px)",
            zIndex: "101",
            // position: "absolute",
            // top: "-5px",
            // bottom: "0",
            // left: "0",
            right: "0",
            padding: "0",
            // paddingBottom: "0.1em",
            margin: "0",
            marginTop: "-138px",
            marginRight: "30px",
            // display: "flex",
            // flexDirection: "row",
            // alignItems: "center",
            // justifyContent: "flex-end",
            // pointerEvents: "none",
        }}>
        <div style={{
            // pointerEvents: "all",
            display: "inline-block",
            fontSize: "90%",
        }}>
            {
            // ${props.__("catalog.opds.info.numberOfItems")}
            // `(${tableRows.length})`
            }
            <CellGlobalFilter
                    preGlobalFilteredRows={tableInstance.preGlobalFilteredRows}
                    globalFilteredRows={tableInstance.globalFilteredRows}
                    globalFilter={tableInstance.state.globalFilter}
                    setGlobalFilter={tableInstance.setGlobalFilter}
                    __={props.__}
                    translator={props.translator}
                    displayType={props.displayType}
                    focusInputRef={props.focusInputRef}
                />
        </div></div>

        <div style={{
            // border: "1px solid red",
            position: "fixed",
            // width: "calc(100% - 50px)",
            // zIndex: "9999",
            // position: "absolute",
            // top: "-5px",
            // bottom: "0",
            // left: "0",
            right: "0",
            padding: "0",
            // paddingBottom: "0.1em",
            margin: "0",
            marginTop: "-74px",
            marginRight: "30px",
            // display: "flex",
            // flexDirection: "row",
            // alignItems: "center",
            // justifyContent: "flex-end",
            // pointerEvents: "none",
        }}>
            <div style={{
                // pointerEvents: "all",
                display: "flex",
                alignItems: "center",
            }}>
            <button
            style={{
                margin:"0",
                padding: "0em",
                width: "30px",
                fill: tableInstance.canPreviousPage ? "#333333" : "gray",
            }}
            aria-label={`${props.__("opds.firstPage")}`}
            onClick={() => tableInstance.gotoPage(0)}
            disabled={!tableInstance.canPreviousPage}>
                <SVG svg={ArrowFirstIcon} />
            </button>
            <button
            style={{
                margin:"0",
                padding: "0",
                transform: "rotate(180deg)",
                width: "30px",
                fill: tableInstance.canPreviousPage ? "#333333" : "gray",
            }}
            aria-label={`${props.__("opds.previous")}`}
            onClick={() => tableInstance.previousPage()}
            disabled={!tableInstance.canPreviousPage}>
                <SVG svg={ArrowRightIcon} />
            </button>
            <select
                aria-label={`${props.__("reader.navigation.currentPageTotal", {current: tableInstance.state.pageIndex + 1, total: tableInstance.pageOptions.length})}`}
                style={{cursor: "pointer", minWidth: "5em", textAlign: "center", padding: "0.2em", margin: "0", marginLeft: "0em", marginRight: "0em", border: "1px solid gray", borderRadius: "4px"}}
                value={tableInstance.state.pageIndex}
                onChange={(e) => {
                    const pageIndex = e.target.value ? Number(e.target.value) : 0;
                    tableInstance.gotoPage(pageIndex);
                }}
            >
                {
                ".".repeat(tableInstance.pageOptions.length).split("").map((_s, i) => (
                    <option
                        key={`page${i}`}
                        value={i}>
                        {i + 1} / {tableInstance.pageOptions.length}
                    </option>
                ))
                }
            </select>
            <button
            style={{
                margin:"0",
                padding: "0",
                width: "30px",
                fill: tableInstance.canNextPage ? "#333333" : "gray",
            }}
            aria-label={`${props.__("opds.next")}`}
            onClick={() => tableInstance.nextPage()}
            disabled={!tableInstance.canNextPage}>
                <SVG svg={ArrowRightIcon} />
            </button>
            <button
            style={{
                margin:"0",
                padding: "0em",
                width: "30px",
                fill: tableInstance.canNextPage ? "#333333" : "gray",
            }}
            aria-label={`${props.__("opds.lastPage")}`}
            onClick={() => tableInstance.gotoPage(tableInstance.pageCount - 1)}
            disabled={!tableInstance.canNextPage}>
                <SVG svg={ArrowLastIcon} />
            </button>
            </div>
        </div>

        <div
            style={{
                overflow: "auto",
                position: "absolute",
                top: "0",
                bottom: "0",
                left: "0",
                right: "0",
                padding: "0",
                marginLeft: "30px",
                marginRight: "30px",
                marginTop: "0em",
                marginBottom: "0.4em",
            }}>
        <span
            ref={scrollToViewRef}
            style={{visibility: "hidden"}}>{" "}</span>
        <table {...tableInstance.getTableProps()}
            style={{
                fontSize: "90%",
                border: "solid 1px gray",
                borderRadius: "8px",
                padding: "4px",
                margin: "0",
                // marginRight: "1em",
                borderSpacing: "0",
                // minWidth: "calc(100% - 30px)",
            }}>
            <thead>{tableInstance.headerGroups.map((headerGroup, index) =>
                (<tr key={`headtr_${index}`} {...headerGroup.getHeaderGroupProps()}>{
                headerGroup.headers.map((col, i) => {

                    const column = col as unknown as (
                        ColumnWithLooseAccessor<IColumns> & // { Header: string } &
                        UseTableColumnProps<IColumns> &
                        UseSortByColumnProps<IColumns> &
                        UseFiltersColumnProps<IColumns>
                    );

                    const columnIsSortable = column.id !== "colCover";

                    const W = column.id === "colCover" ?
                        (props.displayType === DisplayType.Grid ? "100px" : "40px") :
                        column.id === "colLCP" ?
                        "60px" :
                        column.id === "colPublishedDate" ?
                        "120px" :
                        column.id === "colProgression" ?
                        "100px" :
                        column.id === "colDuration" ?
                        "100px" :
                        "160px";

                    return (<th
                        key={`headtrth_${i}`}
                        {...column.getHeaderProps(columnIsSortable ? ({...column.getSortByToggleProps(),
                            // @ts-expect-error TS2322
                            title: undefined,
                            onClick: undefined,
                        }) : undefined)}
                        style={{
                            width: W,
                            minWidth: W,
                            maxWidth: W,
                            borderBottom: "1px solid #bcbcbc",
                            borderLeft: "1px solid #bcbcbc",
                            padding: "0.7em",
                            margin: "0",
                            background: "#eeeeee", // columnIsSortable ? "#eeeeee" : "white",
                            color: "black",
                            whiteSpace: "nowrap",
                            // ...{ cursor: columnIsSortable ? "pointer" : undefined },
                        }}
                        >
                        {
                        columnIsSortable ?
                        <><button
                        style={{height: "auto", padding: "0.2em", margin: "0", fontWeight: "bold", fontSize: "100%"}}
                        onClick={() => {
                            column.toggleSortBy();
                        }}
                        aria-label={
                            `${column.Header}${
                            column.isSorted ? (column.isSortedDesc ?
                            ` (${props.__("catalog.column.descending")})`
                            :
                            ` (${props.__("catalog.column.ascending")})`)
                            :
                            ` (${props.__("catalog.column.unsorted")})`
                            }`
                            }
                            >
                            {
                            column.render("Header")
                            }
                            <span>
                            {
                            (column.isSorted ? (column.isSortedDesc ? " ↓" : " ↑") : "")
                            }
                            </span>
                        </button>
                        {
                        column.canFilter ?
                        (<div style={{display: "block"}}>{ column.render("Filter", renderProps_Filter) }</div>)
                        : <></>
                        }
                        </>
                        :
                        // <span
                        // aria-label={`${column.Header}`}
                        //     >
                        //     {
                        //     // props.displayType === DisplayType.List ? "" : column.render("Header")
                        //     // column.render("Header")
                        //     }
                        // </span>
                        <><input
                            aria-label={props.__("header.searchPlaceholder")}
                            id="setShowColumnFiltersCheckbox"
                            type="checkbox"
                            checked={showColumnFilters ? true : false}
                            onChange={() => {
                                setShowColumnFilters(!showColumnFilters);
                                const s = showColumnFilters;
                                setTimeout(() => {
                                    if (!s) {
                                        tableInstance.setGlobalFilter("");
                                    }
                                    if (s) {
                                        for (const col of tableInstance.allColumns) {
                                            tableInstance.setFilter(col.id, "");
                                        }
                                    }
                                }, 200);
                            }}
                            style={{position: "absolute", left: "-999px"}}
                        /><label
                            aria-hidden="true"
                            htmlFor="setShowColumnFiltersCheckbox"
                            style={{cursor: "pointer", padding: "0.2em", paddingBottom: "0", fill: "black", display: "inline-block", width: "16px", border: showColumnFilters ? "2px solid black" : "1px solid gray", borderRadius: "4px"}}>
                            <SVG ariaHidden svg={magnifyingGlass} />
                        </label></>
                        }
                        </th>);
                    },
                )}</tr>),
            )}
            {
            // <tr>
            // <th
            //     colSpan={tableInstance.visibleColumns.length}
            //     >
            //     <CellGlobalFilter
            //         preGlobalFilteredRows={tableInstance.preGlobalFilteredRows}
            //         globalFilteredRows={tableInstance.globalFilteredRows}
            //         globalFilter={tableInstance.state.globalFilter}
            //         setGlobalFilter={tableInstance.setGlobalFilter}
            //         __={props.__}
            //         translator={props.translator}
            //         displayType={props.displayType}
            //     />
            // </th>
            // </tr>
            }

            </thead>
            <tbody {...tableInstance.getTableBodyProps()}>{tableInstance.page.map((row, index) => {
                tableInstance.prepareRow(row);

                return (<tr key={`bodytr_${index}`} {...row.getRowProps()}
                style={{
                    // outlineColor: "#cccccc",
                    // outlineOffset: "0px",
                    // outlineStyle: "solid",
                    // outlineWidth: "1px",
                    backgroundColor: index % 2 ? "#efefef" : undefined,
                }}>{row.cells.map((cell, i) =>
                    {
                        return (<td key={`bodytrtd_${i}`} {...cell.getCellProps()}
                        style={{
                            padding: "0",
                            margin: "0",
                            // border: "solid 1px #eeeeee",
                        }}
                        >{
                            cell.render("Cell", renderProps_Cell)
                        }</td>);
                    },
                    )}
                    </tr>
                );
            })}</tbody>
        </table>
        </div>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslator(AllPublicationPage));
