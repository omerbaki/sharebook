import React, { useState, useEffect, useReducer } from 'react';

import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';

import { createBookmark, deleteBookmark } from './graphql/mutations';
import { listBookmarks } from './graphql/queries';
import { onCreateBookmark, onDeleteBookmark } from './graphql/subscriptions';

import AddBookMark from './components/AddBookMark';
import BookMark from './components/BookMark';

import awsconfig from './aws-exports';
import './App.css';

// Action Types
const QUERY = 'QUERY';
const CREATE_BOOKMARK = 'CREATE_BOOKMARK';
const DELETE_BOOKMARK = 'DELETE_BOOKMARK';

// Configure Amplify
API.configure(awsconfig);
PubSub.configure(awsconfig);


const initialState = {
  bookmarks: [],
};


const reducer = (state, action) => {
  switch (action.type) {
    case QUERY:
      return {...state, bookmarks: action.bookmarks};
    case CREATE_BOOKMARK:
      return {...state, bookmarks:[...state.bookmarks, action.bookmark]};
    case DELETE_BOOKMARK: 
      return {...state,  bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== action.bookmark.id)};
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

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async (bookmark) => {    
    await createNewBookmark(bookmark);
    setShow(false);
  }
  const handleDelete = async (bookmark) => {
    await deleteExistingBookmark(bookmark);
  }

  useEffect(() => {
    async function getData() {
      const bookmarksData = await API.graphql(graphqlOperation(listBookmarks));
      dispatch({ type: QUERY, bookmarks: bookmarksData.data.listBookmarks.items });
    }
    getData();

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
        <button onClick={handleShow}>Add Bookmark</button>
        <AddBookMark show={show} onHide={handleClose} onSave={handleSave}/>
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
