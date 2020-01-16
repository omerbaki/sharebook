import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './index.css';

const Book = (props) => {
    const bookLink = '/my-books/' + props.book.id;
    const deleteBook = () => {
        props.onDelete(props.book);
    }

    return (
        <div className={'book-container'}>
            <Link to={bookLink}>{props.book.name}</Link>
            <Button className="delete-btn" onClick={deleteBook}>
                delete
            </Button>
        </div>
    );
}

export default Book;
