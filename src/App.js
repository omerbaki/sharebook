import React, { useState, useEffect, useReducer } from 'react';

import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';

import { createBookmark, deleteBookmark, createTag } from './graphql/mutations';
import { listBookmarks, listTags } from './graphql/queries';
import { onCreateBookmark, onDeleteBookmark } from './graphql/subscriptions';

import AddBookMark from './components/AddBookMark';
import AddTag from './components/AddTag';
import BookMark from './components/BookMark';

import awsconfig from './aws-exports';
import './App.css';

// Action Types
const QUERY_TAG = "QUERY_TAG";
const QUERY_BOOKMARK = 'QUERY_BOOKMARK';
const CREATE_BOOKMARK = 'CREATE_BOOKMARK';
const DELETE_BOOKMARK = 'DELETE_BOOKMARK';

// Configure Amplify
API.configure(awsconfig);
PubSub.configure(awsconfig);


const initialState = {
  tags: [],
  bookmarks: [],
};


const reducer = (state, action) => {
  switch (action.type) {
    case QUERY_BOOKMARK:
      return {...state, bookmarks: action.bookmarks};
    case CREATE_BOOKMARK:
      return {...state, bookmarks:[...state.bookmarks, action.bookmark]};
    case DELETE_BOOKMARK: 
      return {...state,  bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== action.bookmark.id)};
    case QUERY_TAG:
      return {...state, tags: action.tags};
    default:
      return state;
  }
};

async function createNewBookmark(bookmark) {
  await API.graphql(graphqlOperation(createBookmark, { input: bookmark }));
}

async function deleteExistingBookmark(bookmark) {
  try {
    const bookmarkToDelete = {id: bookmark.id};
    await API.graphql(graphqlOperation(deleteBookmark, { input: bookmarkToDelete }));
  } catch(err) {
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
  const handleSaveBookmark= async (bookmark) => {    
    await createNewBookmark(bookmark);
    setShowAddBookmark(false);
  }
  const handleDelete = async (bookmark) => {
    await deleteExistingBookmark(bookmark);
  }

  const handleCloseAddTag = () => setShowAddTag(false);
  const handleShowAddTag = () => setShowAddTag(true);
  const handleSaveTag= async (tag) => {    
    await createNewTag(tag);
    setShowAddTag(false);
  }


  useEffect(() => {
    async function getTags() {
      const tagsData = await API.graphql(graphqlOperation(listTags));
      dispatch({ type: QUERY_TAG, tags: tagsData.data.listTags.items });
    }
    getTags();

    async function getBookmarks() {
      const bookmarksData = await API.graphql(graphqlOperation(listBookmarks));
      dispatch({ type: QUERY_BOOKMARK, bookmarks: bookmarksData.data.listBookmarks.items });
    }
    getBookmarks();

    const createSubscription = API.graphql(graphqlOperation(onCreateBookmark)).subscribe({
      next: (eventData) => {
        const bookmark = eventData.value.data.onCreateBookmark;
        dispatch({ type: CREATE_BOOKMARK, bookmark });
      }
    });

    const deleteSubscription = API.graphql(graphqlOperation(onDeleteBookmark)).subscribe({
      next: (eventData) => {
        const bookmark = eventData.value.data.onDeleteBookmark;
        dispatch({ type: DELETE_BOOKMARK, bookmark });
      }
    });


    return () => {
      createSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    }

  }, []);

  return (
    <div>
      <div className="App">
        <button onClick={handleShowAddBookmark}>Add Bookmark</button>
        <AddBookMark show={showAddBookmark} onHide={handleCloseAddBookmark} onSave={handleSaveBookmark} tags={state.tags}/>
        <button onClick={handleShowAddTag}>Add Tag</button>
        <AddTag show={showAddTag} onHide={handleCloseAddTag} onSave={handleSaveTag}/>
      </div>
      <div>
        {state.bookmarks.length > 0 ? 
          state.bookmarks.map((bm) => 
            <BookMark  key={bm.id} bookmark={bm} onDelete={handleDelete}/>
          ) :
          <p>Add more bookmarks!</p> 
        }
      </div>
    </div>
  );
}

export default App;
