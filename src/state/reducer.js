const ACTIONS = {
    QUERY_BOOK: "QUERY_BOOK",
    QUERY_TAG: "QUERY_TAG",
    CREATE_TAG: "CREATE_TAG",
    QUERY_BOOKMARK: 'QUERY_BOOKMARK',
    CREATE_BOOKMARK: 'CREATE_BOOKMARK',
    DELETE_BOOKMARK: 'DELETE_BOOKMARK'
}

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.QUERY_BOOK:
            return { ...state, books: action.books };
        case ACTIONS.QUERY_BOOKMARK:
            return { ...state, bookmarks: action.bookmarks };
        case ACTIONS.CREATE_BOOKMARK:
            return { ...state, bookmarks: [...state.bookmarks, action.bookmark] };
        case ACTIONS.DELETE_BOOKMARK:
            return { ...state, bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== action.bookmark.id) };
        case ACTIONS.QUERY_TAG:
            return { ...state, tags: action.tags };
        case ACTIONS.CREATE_TAG:
            return { ...state, tags: [...state.tags, action.tag] };
        default:
            return state;
    }
};

export {
    ACTIONS,
    reducer
}