declare namespace typed_i18n {
  interface TFunction {
  (_: "accessibility", __?: {}): {
  readonly "bookAuthor": string,
  readonly "bookPublisher": string,
  readonly "bookReleaseDate": string,
  readonly "bookTitle": string,
  readonly "closeDialog": string,
  readonly "homeMenu": string,
  readonly "importFile": string,
  readonly "searchBook": string,
  readonly "skipLink": string
};
  (_: "accessibility.bookAuthor", __?: {}): string;
  (_: "accessibility.bookPublisher", __?: {}): string;
  (_: "accessibility.bookReleaseDate", __?: {}): string;
  (_: "accessibility.bookTitle", __?: {}): string;
  (_: "accessibility.closeDialog", __?: {}): string;
  (_: "accessibility.homeMenu", __?: {}): string;
  (_: "accessibility.importFile", __?: {}): string;
  (_: "accessibility.searchBook", __?: {}): string;
  (_: "accessibility.skipLink", __?: {}): string;
  (_: "app", __?: {}): {
  readonly "edit": {
    readonly "copy": string,
    readonly "cut": string,
    readonly "paste": string,
    readonly "redo": string,
    readonly "selectAll": string,
    readonly "title": string,
    readonly "undo": string
  },
  readonly "quit": string
};
  (_: "app.edit", __?: {}): {
  readonly "copy": string,
  readonly "cut": string,
  readonly "paste": string,
  readonly "redo": string,
  readonly "selectAll": string,
  readonly "title": string,
  readonly "undo": string
};
  (_: "app.edit.copy", __?: {}): string;
  (_: "app.edit.cut", __?: {}): string;
  (_: "app.edit.paste", __?: {}): string;
  (_: "app.edit.redo", __?: {}): string;
  (_: "app.edit.selectAll", __?: {}): string;
  (_: "app.edit.title", __?: {}): string;
  (_: "app.edit.undo", __?: {}): string; (_: "app.quit", __?: {}): string;
  (_: "catalog", __?: {}): {
  readonly "about": { readonly "button": string, readonly "title": string },
  readonly "addBookToLib": string,
  readonly "addTags": string,
  readonly "addTeaserToLib": string,
  readonly "allBooks": string,
  readonly "bookInfo": string,
  readonly "delete": string,
  readonly "deleteBook": string,
  readonly "deleteTag": string,
  readonly "description": string,
  readonly "emptyTagList": string,
  readonly "entry": {
    readonly "continueReading": string,
    readonly "lastAdditions": string
  },
  readonly "export": string,
  readonly "id": string,
  readonly "lang": string,
  readonly "moreInfo": string,
  readonly "myBooks": string,
  readonly "noPublicationHelpL1": string,
  readonly "noPublicationHelpL2": string,
  readonly "noPublicationHelpL3": string,
  readonly "publisher": string,
  readonly "readBook": string,
  readonly "released": string,
  readonly "sort": string,
  readonly "tagCount": string,
  readonly "tags": string
};
  (_: "catalog.about", __?: {}): { readonly "button": string, readonly "title": string };
  (_: "catalog.about.button", __?: {}): string;
  (_: "catalog.about.title", __?: {}): string;
  (_: "catalog.addBookToLib", __?: {}): string;
  (_: "catalog.addTags", __?: {}): string;
  (_: "catalog.addTeaserToLib", __?: {}): string;
  (_: "catalog.allBooks", __?: {}): string;
  (_: "catalog.bookInfo", __?: {}): string;
  (_: "catalog.delete", __?: {}): string;
  (_: "catalog.deleteBook", __?: {}): string;
  (_: "catalog.deleteTag", __?: {}): string;
  (_: "catalog.description", __?: {}): string;
  (_: "catalog.emptyTagList", __?: {}): string;
  (_: "catalog.entry", __?: {}): { readonly "continueReading": string, readonly "lastAdditions": string };
  (_: "catalog.entry.continueReading", __?: {}): string;
  (_: "catalog.entry.lastAdditions", __?: {}): string;
  (_: "catalog.export", __?: {}): string; (_: "catalog.id", __?: {}): string;
  (_: "catalog.lang", __?: {}): string;
  (_: "catalog.moreInfo", __?: {}): string;
  (_: "catalog.myBooks", __?: {}): string;
  (_: "catalog.noPublicationHelpL1", __?: {}): string;
  (_: "catalog.noPublicationHelpL2", __?: {}): string;
  (_: "catalog.noPublicationHelpL3", __?: {}): string;
  (_: "catalog.publisher", __?: {}): string;
  (_: "catalog.readBook", __?: {}): string;
  (_: "catalog.released", __?: {}): string;
  (_: "catalog.sort", __?: {}): string;
  (_: "catalog.tagCount", __?: {}): string;
  (_: "catalog.tags", __?: {}): string;
  (_: "dialog", __?: {}): {
  readonly "alreadyAdd": string,
  readonly "closeModalWindow": string,
  readonly "deleteFeed": string,
  readonly "deletePublication": string,
  readonly "import": string,
  readonly "importError": string,
  readonly "no": string,
  readonly "renew": string,
  readonly "return": string,
  readonly "sure": string,
  readonly "yes": string
};
  (_: "dialog.alreadyAdd", __?: {}): string;
  (_: "dialog.closeModalWindow", __?: {}): string;
  (_: "dialog.deleteFeed", __?: {}): string;
  (_: "dialog.deletePublication", __?: {}): string;
  (_: "dialog.import", __?: {}): string;
  (_: "dialog.importError", __?: {}): string;
  (_: "dialog.no", __?: {}): string; (_: "dialog.renew", __?: {}): string;
  (_: "dialog.return", __?: {}): string; (_: "dialog.sure", __?: {}): string;
  (_: "dialog.yes", __?: {}): string;
  (_: "header", __?: {}): {
  readonly "allBooks": string,
  readonly "books": string,
  readonly "catalogs": string,
  readonly "gridTitle": string,
  readonly "home": string,
  readonly "importTitle": string,
  readonly "listTitle": string,
  readonly "searchPlaceholder": string,
  readonly "searchTitle": string,
  readonly "settings": string
};
  (_: "header.allBooks", __?: {}): string;
  (_: "header.books", __?: {}): string;
  (_: "header.catalogs", __?: {}): string;
  (_: "header.gridTitle", __?: {}): string;
  (_: "header.home", __?: {}): string;
  (_: "header.importTitle", __?: {}): string;
  (_: "header.listTitle", __?: {}): string;
  (_: "header.searchPlaceholder", __?: {}): string;
  (_: "header.searchTitle", __?: {}): string;
  (_: "header.settings", __?: {}): string;
  (_: "library", __?: {}): {
  readonly "lcp": {
    readonly "cancel": string,
    readonly "hint": string,
    readonly "password": string,
    readonly "sentence": string,
    readonly "submit": string
  }
};
  (_: "library.lcp", __?: {}): {
  readonly "cancel": string,
  readonly "hint": string,
  readonly "password": string,
  readonly "sentence": string,
  readonly "submit": string
};
  (_: "library.lcp.cancel", __?: {}): string;
  (_: "library.lcp.hint", __?: {}): string;
  (_: "library.lcp.password", __?: {}): string;
  (_: "library.lcp.sentence", __?: {}): string;
  (_: "library.lcp.submit", __?: {}): string;
  (_: "message", __?: {}): {
  readonly "download": {
    readonly "start": string,
    readonly "success": string
  },
  readonly "import": { readonly "success": string }
};
  (_: "message.download", __?: {}): { readonly "start": string, readonly "success": string };
  (_: "message.download.start", __?: {}): string;
  (_: "message.download.success", __?: {}): string;
  (_: "message.import", __?: {}): { readonly "success": string };
  (_: "message.import.success", __?: {}): string;
  (_: "opds", __?: {}): {
  readonly "addForm": {
    readonly "addButton": string,
    readonly "name": string,
    readonly "namePlaceholder": string,
    readonly "pasteUrl": string,
    readonly "title": string,
    readonly "url": string,
    readonly "urlPlaceholder": string
  },
  readonly "addMenu": string,
  readonly "back": string,
  readonly "breadcrumbRoot": string,
  readonly "menu": {
    readonly "aboutBook": string,
    readonly "addExtract": string,
    readonly "addTeaser": string,
    readonly "goBuyBook": string,
    readonly "goLoanBook": string,
    readonly "goSubBook": string
  },
  readonly "empty": string
};
  (_: "opds.addForm", __?: {}): {
  readonly "addButton": string,
  readonly "name": string,
  readonly "namePlaceholder": string,
  readonly "pasteUrl": string,
  readonly "title": string,
  readonly "url": string,
  readonly "urlPlaceholder": string
};
  (_: "opds.addForm.addButton", __?: {}): string;
  (_: "opds.addForm.name", __?: {}): string;
  (_: "opds.addForm.namePlaceholder", __?: {}): string;
  (_: "opds.addForm.pasteUrl", __?: {}): string;
  (_: "opds.addForm.title", __?: {}): string;
  (_: "opds.addForm.url", __?: {}): string;
  (_: "opds.addForm.urlPlaceholder", __?: {}): string;
  (_: "opds.addMenu", __?: {}): string; (_: "opds.back", __?: {}): string;
  (_: "opds.breadcrumbRoot", __?: {}): string;
  (_: "opds.empty", __?: {}): string;
  (_: "opds.menu", __?: {}): {
  readonly "aboutBook": string,
  readonly "addExtract": string,
  readonly "addTeaser": string,
  readonly "goBuyBook": string,
  readonly "goLoanBook": string,
  readonly "goSubBook": string
};
  (_: "opds.menu.aboutBook", __?: {}): string;
  (_: "opds.menu.addExtract", __?: {}): string;
  (_: "opds.menu.addTeaser", __?: {}): string;
  (_: "opds.menu.goBuyBook", __?: {}): string;
  (_: "opds.menu.goLoanBook", __?: {}): string;
  (_: "opds.menu.goSubBook", __?: {}): string;
  (_: "publication", __?: {}): {
  readonly "deleteButton": string,
  readonly "expiredLcp": string,
  readonly "readButton": string,
  readonly "renewButton": string,
  readonly "returnButton": string,
  readonly "returnedLcp": string,
  readonly "revokedLcp": string,
  readonly "seeLess": string,
  readonly "seeMore": string
};
  (_: "publication.deleteButton", __?: {}): string;
  (_: "publication.expiredLcp", __?: {}): string;
  (_: "publication.readButton", __?: {}): string;
  (_: "publication.renewButton", __?: {}): string;
  (_: "publication.returnButton", __?: {}): string;
  (_: "publication.returnedLcp", __?: {}): string;
  (_: "publication.revokedLcp", __?: {}): string;
  (_: "publication.seeLess", __?: {}): string;
  (_: "publication.seeMore", __?: {}): string;
  (_: "reader", __?: {}): {
  readonly "footerInfo": {
    readonly "lessInfo": string,
    readonly "moreInfo": string
  },
  readonly "marks": {
    readonly "annotations": string,
    readonly "bookmarks": string,
    readonly "illustrations": string,
    readonly "toc": string
  },
  readonly "navigation": {
    readonly "backHomeTitle": string,
    readonly "bookmarkTitle": string,
    readonly "detachWindowTitle": string,
    readonly "fullscreenTitle": string,
    readonly "infoTitle": string,
    readonly "openTableOfContentsTitle": string,
    readonly "quitFullscreenTitle": string,
    readonly "readBookTitle": string,
    readonly "settingsTitle": string
  },
  readonly "settings": {
    readonly "column": {
      readonly "auto": string,
      readonly "one": string,
      readonly "oneTitle": string,
      readonly "title": string,
      readonly "two": string,
      readonly "twoTitle": string
    },
    readonly "display": string,
    readonly "disposition": { readonly "title": string },
    readonly "font": string,
    readonly "fontSize": string,
    readonly "justification": string,
    readonly "justify": string,
    readonly "left": string,
    readonly "letterSpacing": string,
    readonly "lineSpacing": string,
    readonly "margin": string,
    readonly "paginated": string,
    readonly "scrolled": string,
    readonly "spacing": string,
    readonly "text": string,
    readonly "theme": {
      readonly "name": {
        readonly "Neutral": string,
        readonly "Night": string,
        readonly "Sepia": string
      },
      readonly "title": string
    },
    readonly "wordSpacing": string
  },
  readonly "svg": { readonly "left": string, readonly "right": string }
};
  (_: "reader.footerInfo", __?: {}): { readonly "lessInfo": string, readonly "moreInfo": string };
  (_: "reader.footerInfo.lessInfo", __?: {}): string;
  (_: "reader.footerInfo.moreInfo", __?: {}): string;
  (_: "reader.marks", __?: {}): {
  readonly "annotations": string,
  readonly "bookmarks": string,
  readonly "illustrations": string,
  readonly "toc": string
};
  (_: "reader.marks.annotations", __?: {}): string;
  (_: "reader.marks.bookmarks", __?: {}): string;
  (_: "reader.marks.illustrations", __?: {}): string;
  (_: "reader.marks.toc", __?: {}): string;
  (_: "reader.navigation", __?: {}): {
  readonly "backHomeTitle": string,
  readonly "bookmarkTitle": string,
  readonly "detachWindowTitle": string,
  readonly "fullscreenTitle": string,
  readonly "infoTitle": string,
  readonly "openTableOfContentsTitle": string,
  readonly "quitFullscreenTitle": string,
  readonly "readBookTitle": string,
  readonly "settingsTitle": string
};
  (_: "reader.navigation.backHomeTitle", __?: {}): string;
  (_: "reader.navigation.bookmarkTitle", __?: {}): string;
  (_: "reader.navigation.detachWindowTitle", __?: {}): string;
  (_: "reader.navigation.fullscreenTitle", __?: {}): string;
  (_: "reader.navigation.infoTitle", __?: {}): string;
  (_: "reader.navigation.openTableOfContentsTitle", __?: {}): string;
  (_: "reader.navigation.quitFullscreenTitle", __?: {}): string;
  (_: "reader.navigation.readBookTitle", __?: {}): string;
  (_: "reader.navigation.settingsTitle", __?: {}): string;
  (_: "reader.settings", __?: {}): {
  readonly "column": {
    readonly "auto": string,
    readonly "one": string,
    readonly "oneTitle": string,
    readonly "title": string,
    readonly "two": string,
    readonly "twoTitle": string
  },
  readonly "display": string,
  readonly "disposition": { readonly "title": string },
  readonly "font": string,
  readonly "fontSize": string,
  readonly "justification": string,
  readonly "justify": string,
  readonly "left": string,
  readonly "letterSpacing": string,
  readonly "lineSpacing": string,
  readonly "margin": string,
  readonly "paginated": string,
  readonly "scrolled": string,
  readonly "spacing": string,
  readonly "text": string,
  readonly "theme": {
    readonly "name": {
      readonly "Neutral": string,
      readonly "Night": string,
      readonly "Sepia": string
    },
    readonly "title": string
  },
  readonly "wordSpacing": string
};
  (_: "reader.settings.column", __?: {}): {
  readonly "auto": string,
  readonly "one": string,
  readonly "oneTitle": string,
  readonly "title": string,
  readonly "two": string,
  readonly "twoTitle": string
};
  (_: "reader.settings.column.auto", __?: {}): string;
  (_: "reader.settings.column.one", __?: {}): string;
  (_: "reader.settings.column.oneTitle", __?: {}): string;
  (_: "reader.settings.column.title", __?: {}): string;
  (_: "reader.settings.column.two", __?: {}): string;
  (_: "reader.settings.column.twoTitle", __?: {}): string;
  (_: "reader.settings.display", __?: {}): string;
  (_: "reader.settings.disposition", __?: {}): { readonly "title": string };
  (_: "reader.settings.disposition.title", __?: {}): string;
  (_: "reader.settings.font", __?: {}): string;
  (_: "reader.settings.fontSize", __?: {}): string;
  (_: "reader.settings.justification", __?: {}): string;
  (_: "reader.settings.justify", __?: {}): string;
  (_: "reader.settings.left", __?: {}): string;
  (_: "reader.settings.letterSpacing", __?: {}): string;
  (_: "reader.settings.lineSpacing", __?: {}): string;
  (_: "reader.settings.margin", __?: {}): string;
  (_: "reader.settings.paginated", __?: {}): string;
  (_: "reader.settings.scrolled", __?: {}): string;
  (_: "reader.settings.spacing", __?: {}): string;
  (_: "reader.settings.text", __?: {}): string;
  (_: "reader.settings.theme", __?: {}): {
  readonly "name": {
    readonly "Neutral": string,
    readonly "Night": string,
    readonly "Sepia": string
  },
  readonly "title": string
};
  (_: "reader.settings.theme.name", __?: {}): {
  readonly "Neutral": string,
  readonly "Night": string,
  readonly "Sepia": string
};
  (_: "reader.settings.theme.name.Neutral", __?: {}): string;
  (_: "reader.settings.theme.name.Night", __?: {}): string;
  (_: "reader.settings.theme.name.Sepia", __?: {}): string;
  (_: "reader.settings.theme.title", __?: {}): string;
  (_: "reader.settings.wordSpacing", __?: {}): string;
  (_: "reader.svg", __?: {}): { readonly "left": string, readonly "right": string };
  (_: "reader.svg.left", __?: {}): string;
  (_: "reader.svg.right", __?: {}): string;
  (_: "settings", __?: {}): {
  readonly "information": string,
  readonly "language": { readonly "languageChoice": string },
  readonly "uiLanguage": string
};
  (_: "settings.information", __?: {}): string;
  (_: "settings.language", __?: {}): { readonly "languageChoice": string };
  (_: "settings.language.languageChoice", __?: {}): string;
  (_: "settings.uiLanguage", __?: {}): string
}
}
export = typed_i18n;
