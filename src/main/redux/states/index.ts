// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import { ReaderConfig, ReaderMode } from "readium-desktop/common/models/reader";
import { I18NState } from "readium-desktop/common/redux/states/i18n";
import { KeyboardState } from "readium-desktop/common/redux/states/keyboard";
import { OpdsFeedDocument } from "readium-desktop/main/db/document/opds";
import { TPQueueState } from "readium-desktop/utils/redux-reducers/pqueue.reducer";

import { AppState } from "./app";
import { ILcpState } from "./lcp";
import { IDictPublicationState } from "./publication";
import { ISessionState } from "./session";
import { StreamerState } from "./streamer";
import { IDictWinRegistryReaderState } from "./win/registry/reader";
import { IWinSessionLibraryState } from "./win/session/library";
import { IDictWinSessionReaderState } from "./win/session/reader";

export interface RootState {
    session: ISessionState;
    app: AppState;
    // net: NetState;
    i18n: I18NState;
    streamer: StreamerState;
    reader: {
        defaultConfig: ReaderConfig,
    };
    // update: UpdateState;
    win: {
        session: {
            library: IWinSessionLibraryState,
            reader: IDictWinSessionReaderState,
        },
        registry: {
            reader: IDictWinRegistryReaderState,
        },
    };
    mode: ReaderMode;
    lcp: ILcpState;
    publication: {
        lastReadingQueue: TPQueueState;
        db: IDictPublicationState;
    };
    keyboard: KeyboardState;
    opds: {
        catalog: OpdsFeedDocument[];
    },
    version: string;
}


export type PersistRootState = Pick<RootState, "win" | "publication" | "reader" | "session" | "i18n" | "opds" | "version">;
