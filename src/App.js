import React, { useState, useEffect, useReducer } from 'react';

import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';

import { createBookmark, deleteBookmark, createTag } from './graphql/mutations';
import { listBookmarks, listTags } from './graphql/queries';
import { onCreateBookmark, onDeleteBookmark, onCreateTag } from './graphql/subscriptions';

import { reducer, ACTIONS } from './state/reducer';

import AddBookMark from './components/AddBookMark';
import AddTag from './components/AddTag';
import BookMark from './components/BookMark';

import awsconfig from './aws-exports';
import './App.css';

import sharebookImg from './sharebook.png'

// Configure Amplify
API.configure(awsconfig);
PubSub.configure(awsconfig);

const initialState = {
  tags: [],
  bookmarks: [],
};

async function createNewBookmark(bookmark) {
  await API.graphql(graphqlOperation(createBookmark, { input: bookmark }));
}

async function deleteExistingBookmark(bookmark) {
  try {
    const bookmarkToDelete = { id: bookmark.id };
    await API.graphql(graphqlOperation(deleteBookmark, { input: bookmarkToDelete }));
  } catch (err) {
    console.log(JSON.stringify(err));
  }
}

async function createNewTag(tag) {
  await API.graphql(graphqlOperation(createTag, { input: tag }));
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showAddBookmark, setShowAddBookmark] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);

  const handleCloseAddBookmark = () => setShowAddBookmark(false);
  const handleShowAddBookmark = () => setShowAddBookmark(true);
  const handleSaveBookmark = async (bookmark) => {
    await createNewBookmark(bookmark);
    setShowAddBookmark(false);
  }
  const handleDelete = async (bookmark) => {
    await deleteExistingBookmark(bookmark);
  }

  const handleCloseAddTag = () => setShowAddTag(false);
  const handleShowAddTag = () => setShowAddTag(true);
  const handleSaveTag = async (tag) => {
    await createNewTag(tag);
    setShowAddTag(false);
  }


  useEffect(() => {
    async function getTags() {
      const tagsData = await API.graphql(graphqlOperation(listTags));
      dispatch({ type: ACTIONS.QUERY_TAG, tags: tagsData.data.listTags.items });
    }
    getTags();

    async function getBookmarks() {
      const bookmarksData = await API.graphql(graphqlOperation(listBookmarks));
      dispatch({ type: ACTIONS.QUERY_BOOKMARK, bookmarks: bookmarksData.data.listBookmarks.items });
    }
    getBookmarks();

    const createSubscription = API.graphql(graphqlOperation(onCreateBookmark)).subscribe({
      next: (eventData) => {
        const bookmark = eventData.value.data.onCreateBookmark;
        dispatch({ type: ACTIONS.CREATE_BOOKMARK, bookmark });
      }
    });

    const deleteSubscription = API.graphql(graphqlOperation(onDeleteBookmark)).subscribe({
      next: (eventData) => {
        const bookmark = eventData.value.data.onDeleteBookmark;
        dispatch({ type: ACTIONS.DELETE_BOOKMARK, bookmark });
      }
    });

    const createTagSubscription = API.graphql(graphqlOperation(onCreateTag)).subscribe({
      next: (eventData) => {
        const tag = eventData.value.data.onCreateTag;
        dispatch({ type: ACTIONS.CREATE_TAG, tag });
      }
    });

    return () => {
      createSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
      createTagSubscription.unsubscribe();
    }

  }, []);

  return (
    <div className="app-container">
      <div className="App-Logo">
        <img src={sharebookImg} />
      </div>
      <div className="bookmarks-container">
        <div className="settings-container">
          <div className="search-container">
            <input type="text" className="form-control"
              onChange={e => console.log(e)} placeholder="Search..." />
          </div>
          <div className="add-buttons">
            <button onClick={handleShowAddBookmark}>Add Bookmark</button>
            <AddBookMark show={showAddBookmark} onHide={handleCloseAddBookmark} onSave={handleSaveBookmark} tags={state.tags} />
            <button onClick={handleShowAddTag}>Add Tag</button>
            <AddTag show={showAddTag} onHide={handleCloseAddTag} onSave={handleSaveTag} />
          </div>
        </div>
        <div>
          {state.bookmarks.length > 0 ?
            state.bookmarks.map((bm) =>
              <BookMark key={bm.id} bookmark={bm} onDelete={handleDelete} />
            ) :
            <p>Add more bookmarks!</p>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
