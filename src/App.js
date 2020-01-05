import React, { useState, useEffect, useReducer } from 'react';

import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';

import { createBookmark } from './graphql/mutations';
import { listBookmarks } from './graphql/queries';
import { onCreateBookmark } from './graphql/subscriptions';

import AddBookMark from './components/AddBookMark';

import awsconfig from './aws-exports';
import './App.css';

// Action Types
const QUERY = 'QUERY';
const SUBSCRIPTION = 'SUBSCRIPTION';


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
    case SUBSCRIPTION:
      return {...state, bookmarks:[...state.bookmarks, action.bookmark]};
    default:
      return state;
  }
};

async function createNewBookmark(bookmark) {
  // const bookmark = { url: "https://www.google.com" , description: "Google search engine" };
  await API.graphql(graphqlOperation(createBookmark, { input: bookmark }));
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    async function getData() {
      const bookmarksData = await API.graphql(graphqlOperation(listBookmarks));
      dispatch({ type: QUERY, bookmarks: bookmarksData.data.listBookmarks.items });
    }
    getData();

    const subscription = API.graphql(graphqlOperation(onCreateBookmark)).subscribe({
      next: (eventData) => {
        const bookmark = eventData.value.data.onCreateBookmark;
        dispatch({ type: SUBSCRIPTION, bookmark });
      }
    });
    return () => subscription.unsubscribe();

  }, []);

  return (
    <div>
      <div className="App">
        <button onClick={handleShow}>Add Bookmark</button>
        <AddBookMark show={show} onHide={handleClose} createBookmark={createNewBookmark}/>
      </div>
      <div>
        {state.bookmarks.length > 0 ? 
          state.bookmarks.map((bookmark) => 
            <p key={bookmark.id}>{bookmark.url} : {bookmark.description}</p>
          ) :
          <p>Add more bookmarks!</p> 
        }
      </div>
    </div>
  );
}

export default App;
