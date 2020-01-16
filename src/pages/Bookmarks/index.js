import React, { useState, useEffect, useReducer } from 'react';

import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';

import Select from 'react-select';

import { createBookmark, deleteBookmark } from '../../graphql/mutations';
import { getBook, listTags } from '../../graphql/queries';
import { onCreateBookmark, onDeleteBookmark } from '../../graphql/subscriptions';

import { reducer, ACTIONS } from '../../state/reducer';

import AddBookmark from '../../components/AddBookmark';
import BookMark from '../../components/Bookmark';

import awsconfig from '../../aws-exports';
import './index.css';

import sharebookImg from '../../sharebook.png'

// Configure Amplify
API.configure(awsconfig);
PubSub.configure(awsconfig);

const initialState = {
	tags: [],
	loading: true,
	bookmarks: []
};

async function createNewBookmark(bookmark) {
	try {
		await API.graphql(graphqlOperation(createBookmark, 
			{ input: bookmark }));
	} catch(error) {
		console.log("Create bookmark fialed - " + JSON.stringify(error));
	}
}

async function deleteExistingBookmark(bookmark) {
	try {
		const bookmarkToDelete = { id: bookmark.id };
		await API.graphql(graphqlOperation(deleteBookmark, { input: bookmarkToDelete }));
	} catch(error) {
		console.log("Failed to delete bookmark - " + JSON.stringify(error));
	}
}

function BookmarksPage(props) {
	const bookId = props.match.params.bookId;

	const [state, dispatch] = useReducer(reducer, initialState);
	const [showAddBookmark, setShowAddBookmark] = useState(false);
	const [selectedItems, setSelectedItems] = useState([]);
	const [loading, setLoading] = useState(true);

	const handleCloseAddBookmark = () => setShowAddBookmark(false);
	const handleShowAddBookmark = () => setShowAddBookmark(true);
	const handleSaveBookmark = async (bookmark) => {
		bookmark.bookmarkBookId = bookId;
		await createNewBookmark(bookmark);
		setShowAddBookmark(false);
	}
	
	const handleDeleteBookmark = async (bookmark) => {
		await deleteExistingBookmark(bookmark);
	}

	useEffect(() => {
		async function getBookmarks() {
			setLoading(true);

			const bookData = await API.graphql(graphqlOperation(getBook, { id: bookId}));
			dispatch({ type: ACTIONS.QUERY_BOOKMARK, bookmarks: bookData.data.getBook.bookmarks.items });

			setLoading(false);
		}
		getBookmarks();

		async function getTags() {
			const tagsData = await API.graphql(graphqlOperation(listTags));
			dispatch({ type: ACTIONS.QUERY_TAG, tags: tagsData.data.listTags.items });
		}
		getTags();

		const createBookmarkSubscription = API.graphql(graphqlOperation(onCreateBookmark)).subscribe({
			next: (eventData) => {
				const bookmark = eventData.value.data.onCreateBookmark;
				dispatch({ type: ACTIONS.CREATE_BOOKMARK, bookmark });
			}
		});

		const deleteBookmarkSubscription = API.graphql(graphqlOperation(onDeleteBookmark)).subscribe({
			next: (eventData) => {
				const bookmark = eventData.value.data.onDeleteBookmark;
				dispatch({ type: ACTIONS.DELETE_BOOKMARK, bookmark });
			}
		});

		return () => {
			createBookmarkSubscription.unsubscribe();
			deleteBookmarkSubscription.unsubscribe();
		}

	}, [bookId]);

	const options = [];
	state.tags.map(tag => options.push({ 'value': tag.name, 'label': tag.name }));

	const searchChanged = async optionsSelected => {
		setLoading(true);

		setSelectedItems(optionsSelected);

		// var appliedFilter = null;
		// if (optionsSelected.length > 0) {
		// 	const filterTags = [];
		// 	optionsSelected.map(item => filterTags.push({ tags: { contains: item.value } }));
		// 	appliedFilter = { and: filterTags }
		// }

		// const bookmarksData = await API.graphql(graphqlOperation(listBookmarks, { filter: appliedFilter }));
		// dispatch({ type: ACTIONS.QUERY_BOOKMARK, bookmarks: bookmarksData.data.listBookmarks.items });

		setLoading(false);
	};

	return (
		<div className="bookmarks-container">
			<div className="logo-books-container">
				<div className="App-Logo">
					<img src={sharebookImg} alt='' />
				</div>
			</div>
			<div className="add-buttons">
				<button onClick={handleShowAddBookmark}>Add Bookmark</button>
				<AddBookmark show={showAddBookmark} onHide={handleCloseAddBookmark} onSave={handleSaveBookmark} tags={state.tags} />
			</div>

			<div className="search-container">
				<Select
					value={selectedItems}
					onChange={searchChanged}
					options={options}
					isMulti={true}
					placeholder='search...'
				/>
			</div>
			<div className="bookmarks-list">
				{loading ?
					<p>loading...</p> :
					(state.bookmarks.length === 0 ?
						<p>Add bookmarks...</p>	:
						state.bookmarks.map((bm) =>
							<BookMark key={bm.id} bookmark={bm} onDelete={handleDeleteBookmark} />
						))
				}
			</div>
		</div>
	
	);
}

export default BookmarksPage;
