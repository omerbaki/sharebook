import React from 'react';
import { Button } from 'react-bootstrap';
import './index.css';

const Book = (props) => {
    const deleteBook = () => {
        props.onDelete(props.book);
    }

    return (
        <div className="book-container">
            <a href={props.showBook}>{props.book.name}</a>
            <Button className="delete-btn" onClick={deleteBook}>
                delete
            </Button>
        </div>
    );
}

export default Book;
