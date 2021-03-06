/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBook = `subscription OnCreateBook {
  onCreateBook {
    id
    name
    bookmarks {
      items {
        id
        url
        description
        tags
      }
      nextToken
    }
  }
}
`;
export const onUpdateBook = `subscription OnUpdateBook {
  onUpdateBook {
    id
    name
    bookmarks {
      items {
        id
        url
        description
        tags
      }
      nextToken
    }
  }
}
`;
export const onDeleteBook = `subscription OnDeleteBook {
  onDeleteBook {
    id
    name
    bookmarks {
      items {
        id
        url
        description
        tags
      }
      nextToken
    }
  }
}
`;
export const onCreateBookmark = `subscription OnCreateBookmark {
  onCreateBookmark {
    id
    url
    description
    tags
    book {
      id
      name
      bookmarks {
        nextToken
      }
    }
  }
}
`;
export const onUpdateBookmark = `subscription OnUpdateBookmark {
  onUpdateBookmark {
    id
    url
    description
    tags
    book {
      id
      name
      bookmarks {
        nextToken
      }
    }
  }
}
`;
export const onDeleteBookmark = `subscription OnDeleteBookmark {
  onDeleteBookmark {
    id
    url
    description
    tags
    book {
      id
      name
      bookmarks {
        nextToken
      }
    }
  }
}
`;
export const onCreateTag = `subscription OnCreateTag {
  onCreateTag {
    id
    name
    type
  }
}
`;
export const onUpdateTag = `subscription OnUpdateTag {
  onUpdateTag {
    id
    name
    type
  }
}
`;
export const onDeleteTag = `subscription OnDeleteTag {
  onDeleteTag {
    id
    name
    type
  }
}
`;
