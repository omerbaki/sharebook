import React from 'react';
import { Button } from 'react-bootstrap';
import './index.css';

const BookMark = (props) => {
    const deleteBookmark = () => {
        props.onDelete(props.bookmark);
    }

    return (
        <div className="bookmark-container">
            <div className="bookmark-info">
                <a href={props.bookmark.url}>{props.bookmark.description}</a>
                    <div className="urlContainer"><span>{props.bookmark.url}</span></div>
                    {props.bookmark.tags ?
                        props.bookmark.tags.map((tag) =>
                            <div key={props.bookmark.id + "_" + tag} className="tag"><span>{tag}</span></div>
                        ) : <div />
                    }
            </div>
            <Button className="delete-btn" onClick={deleteBookmark}>
                delete
            </Button>
        </div>
    );
}

export default BookMark;
