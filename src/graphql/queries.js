/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBook = `query GetBook($id: ID!) {
  getBook(id: $id) {
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
export const listBooks = `query ListBooks(
  $filter: ModelBookFilterInput
  $limit: Int
  $nextToken: String
) {
  listBooks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      name
      bookmarks {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getBookmark = `query GetBookmark($id: ID!) {
  getBookmark(id: $id) {
    id
    url
    description
    tags
    book {
      name
      bookmarks {
        nextToken
      }
    }
  }
}
`;
export const listBookmarks = `query ListBookmarks(
  $filter: ModelBookmarkFilterInput
  $limit: Int
  $nextToken: String
) {
  listBookmarks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      url
      description
      tags
      book {
        name
      }
    }
    nextToken
  }
}
`;
export const getTag = `query GetTag($id: ID!) {
  getTag(id: $id) {
    id
    name
    type
  }
}
`;
export const listTags = `query ListTags($filter: ModelTagFilterInput, $limit: Int, $nextToken: String) {
  listTags(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      type
    }
    nextToken
  }
}
`;
