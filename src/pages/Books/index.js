import React, { useState, useEffect, useReducer } from 'react';

import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';

import { createBook, deleteBook, createTag } from '../../graphql/mutations';
import { listBooks, listTags } from '../../graphql/queries';
// import { onCreateBook, onDeleteBook, onCreateTag } from '../../graphql/subscriptions';

import { reducer, ACTIONS } from '../../state/reducer';

import AddBook from '../../components/AddBook';
import Book from '../../components/Book';
import AddTag from '../../components/AddTag';

import awsconfig from '../../aws-exports';
import './index.css';

import sharebookImg from '../../sharebook.png'

// Configure Amplify
API.configure(awsconfig);
PubSub.configure(awsconfig);

const initialState = {
	tags: [],
	books: [],
	loading: true,
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

async function createNewTag(tag) {
	await API.graphql(graphqlOperation(createTag, { input: tag }));
}

function BooksPage() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [showAddBook, setShowAddBook] = useState(false);
	const [showAddTag, setShowAddTag] = useState(false);
	const [loading, setLoading] = useState(true);

	const handleCloseAddBook = () => setShowAddBook(false);
	const handleShowAddBook = () => setShowAddBook(true);
	const handleSaveBook = async (book) => {
		await createNewBook(book);
		setShowAddBook(false);
	}
	const handleDeleteBook = async (book) => {
		await deleteExistingBook(book);
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
            console.log("booksData - " + JSON.stringify(booksData));
			dispatch({ type: ACTIONS.QUERY_BOOK, books: booksData.data.listBooks.items });
		}
		getBooks();

		async function getTags() {
			const tagsData = await API.graphql(graphqlOperation(listTags));
			dispatch({ type: ACTIONS.QUERY_TAG, tags: tagsData.data.listTags.items });
		}
		getTags();

		// const createBookSubscription = API.graphql(graphqlOperation(onCreateBook)).subscribe({
		// 	next: (eventData) => {
		// 		const book = eventData.value.data.onCreateBook;
		// 		dispatch({ type: ACTIONS.CREATE_BOOK, book });
		// 	}
		// });

		// const deleteBookSubscription = API.graphql(graphqlOperation(onDeleteBook)).subscribe({
		// 	next: (eventData) => {
		// 		const book = eventData.value.data.onDeleteBook;
		// 		dispatch({ type: ACTIONS.DELETE_BOOK, bookm });
		// 	}
		// });

		// const createTagSubscription = API.graphql(graphqlOperation(onCreateTag)).subscribe({
		// 	next: (eventData) => {
		// 		const tag = eventData.value.data.onCreateTag;
		// 		dispatch({ type: ACTIONS.CREATE_TAG, tag });
		// 	}
		// });

		return () => {
			// createSubscription.unsubscribe();
			// deleteSubscription.unsubscribe();
			// createTagSubscription.unsubscribe();
		}

	}, []);

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
								<Book key={book.id} book={book} onDelete={handleDeleteBook}  />
							) :
							loading ? <p>Loading books...</p> : <p>Add more books!</p>
						}
					</div>
				</div>
			</div>
						{/* <button onClick={handleShowAddTag}>Add Tag</button>
						<AddTag show={showAddTag} onHide={handleCloseAddTag} onSave={handleSaveTag} /> */}
		</div>
	);
}

export default BooksPage;
