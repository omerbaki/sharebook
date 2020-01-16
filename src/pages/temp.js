import React, { useState, useEffect, useReducer } from 'react';

import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';

import Select from 'react-select';

import { createBook, deleteBook, createBookmark, deleteBookmark, createTag } from './graphql/mutations';
import { listBooks, listBookmarks, listTags } from './graphql/queries';
import { onCreateBookmark, onDeleteBookmark, onCreateTag } from './graphql/subscriptions';

import { reducer, ACTIONS } from './state/reducer';

import AddBook from './components/AddBook';
import Book from './components/Book';
import AddBookmark from './components/AddBookmark';
import AddTag from './components/AddTag';
import BookMark from './components/Bookmark';

import awsconfig from './aws-exports';
import './App.css';

import sharebookImg from './sharebook.png'

// Configure Amplify
API.configure(awsconfig);
PubSub.configure(awsconfig);

const initialState = {
	tags: [],
	books: [],
	loading: true,
	selectedBook: {},
	bookmarks: []
};

async function createNewBook(book) {
	await API.graphql(graphqlOperation(createBook, { input: book }));
}

async function deleteExistingBook(book) {
	try {
		const bookToDelete = { id: book.id };
		await API.graphql(graphqlOperation(deleteBook, { input: bookToDelete }));
	} catch (err) {
		console.log(JSON.stringify(err));
	}
}

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

async function createNewTag(tag) {
	await API.graphql(graphqlOperation(createTag, { input: tag }));
}

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [showAddBook, setShowAddBook] = useState(false);
	const [showAddBookmark, setShowAddBookmark] = useState(false);
	const [showAddTag, setShowAddTag] = useState(false);
	const [selectedItems, setSelectedItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedBook, setSelectedBook] = useState({});

	const handleCloseAddBook = () => setShowAddBook(false);
	const handleShowAddBook = () => setShowAddBook(true);
	const handleSaveBook = async (book) => {
		await createNewBook(book);
		setShowAddBook(false);
	}
	const handleDeleteBook = async (book) => {
		await deleteExistingBook(book);
	}
	const handleBookSelected = async (book) => {
		setSelectedBook(book);
	}

	const handleCloseAddBookmark = () => setShowAddBookmark(false);
	const handleShowAddBookmark = () => setShowAddBookmark(true);
	const handleSaveBookmark = async (bookmark) => {
		bookmark.bookmarkBookId = selectedBook.id;
		await createNewBookmark(bookmark);
		setShowAddBookmark(false);
	}
	
	const handleDeleteBookmark = async (bookmark) => {
		await deleteExistingBookmark(bookmark);
	}

	const handleCloseAddTag = () => setShowAddTag(false);
	const handleShowAddTag = () => setShowAddTag(true);
	const handleSaveTag = async (tag) => {
		await createNewTag(tag);
		setShowAddTag(false);
	}

	useEffect(() => {
		async function getBooks() {
			const booksData = await API.graphql(graphqlOperation(listBooks));
			console.log("BOOKS - " + JSON.stringify(booksData.data.listBooks.items));
			dispatch({ type: ACTIONS.QUERY_BOOK, books: booksData.data.listBooks.items });
		}
		getBooks();

		// async function getBookmarks(optionsSelected) {
		// 	setLoading(true);

		// 	const bookmarksData = await API.graphql(graphqlOperation(listBookmarks));
		// 	dispatch({ type: ACTIONS.QUERY_BOOKMARK, bookmarks: bookmarksData.data.listBookmarks.items });
		// 	console.log("bookmarks - " + JSON.stringify(bookmarksData.data.listBookmarks.items));

		// 	setLoading(false);
		// }
		// getBookmarks();

		async function getTags() {
			const tagsData = await API.graphql(graphqlOperation(listTags));
			dispatch({ type: ACTIONS.QUERY_TAG, tags: tagsData.data.listTags.items });
		}
		getTags();

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
		<div className="app-container">
			<div className="logo-books-container">
				<div className="App-Logo">
					<img src={sharebookImg} alt='' />
				</div>
				<div className="books-container">
					<button onClick={handleShowAddBook}>Add Book</button>
					<AddBook show={showAddBook} onHide={handleCloseAddBook} onSave={handleSaveBook} />
					<div className="books-list">
						{state.books.length > 0 ?
							state.books.map((book) =>
								<Book key={book.id} book={book} onSelected={handleBookSelected}
									onDelete={handleDeleteBook} isSelected={selectedBook.id === book.id} />
							) :
							loading ? <p>Loading books...</p> : <p>Add more books!</p>
						}
					</div>
				</div>
			</div>
			<div className="bookmarks-container">
				<div className="settings-container">
					<div className="search-container">
						<Select
							value={selectedItems}
							onChange={searchChanged}
							options={options}
							isMulti={true}
						/>
					</div>
					<div className="add-buttons">
						<button onClick={handleShowAddBookmark}>Add Bookmark</button>
						<AddBookmark show={showAddBookmark} onHide={handleCloseAddBookmark} onSave={handleSaveBookmark} tags={state.tags} />
						<button onClick={handleShowAddTag}>Add Tag</button>
						<AddTag show={showAddTag} onHide={handleCloseAddTag} onSave={handleSaveTag} />
					</div>
				</div>
				<div>
					{selectedBook.id ?
						(state.bookmarks.length === 0 ?
							<p>Add bookmarks...</p>	:
							state.bookmarks.map((bm) =>
								<BookMark key={bm.id} bookmark={bm} onDelete={handleDeleteBookmark} />
							))
						: <p>Select book!</p>
					}
				</div>
			</div>
		</div>
	);
}

export default App;
