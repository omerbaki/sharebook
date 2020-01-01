/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBookmark = `mutation CreateBookmark(
  $input: CreateBookmarkInput!
  $condition: ModelBookmarkConditionInput
) {
  createBookmark(input: $input, condition: $condition) {
    id
    url
    description
    tags
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
  }
}
`;
