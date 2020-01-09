/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBook = `mutation CreateBook(
  $input: CreateBookInput!
  $condition: ModelBookConditionInput
) {
  createBook(input: $input, condition: $condition) {
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
export const updateBook = `mutation UpdateBook(
  $input: UpdateBookInput!
  $condition: ModelBookConditionInput
) {
  updateBook(input: $input, condition: $condition) {
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
export const deleteBook = `mutation DeleteBook(
  $input: DeleteBookInput!
  $condition: ModelBookConditionInput
) {
  deleteBook(input: $input, condition: $condition) {
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
export const createBookmark = `mutation CreateBookmark(
  $input: CreateBookmarkInput!
  $condition: ModelBookmarkConditionInput
) {
  createBookmark(input: $input, condition: $condition) {
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
export const updateBookmark = `mutation UpdateBookmark(
  $input: UpdateBookmarkInput!
  $condition: ModelBookmarkConditionInput
) {
  updateBookmark(input: $input, condition: $condition) {
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
export const deleteBookmark = `mutation DeleteBookmark(
  $input: DeleteBookmarkInput!
  $condition: ModelBookmarkConditionInput
) {
  deleteBookmark(input: $input, condition: $condition) {
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
export const createTag = `mutation CreateTag(
  $input: CreateTagInput!
  $condition: ModelTagConditionInput
) {
  createTag(input: $input, condition: $condition) {
    id
    name
    type
  }
}
`;
export const updateTag = `mutation UpdateTag(
  $input: UpdateTagInput!
  $condition: ModelTagConditionInput
) {
  updateTag(input: $input, condition: $condition) {
    id
    name
    type
  }
}
`;
export const deleteTag = `mutation DeleteTag(
  $input: DeleteTagInput!
  $condition: ModelTagConditionInput
) {
  deleteTag(input: $input, condition: $condition) {
    id
    name
    type
  }
}
`;
