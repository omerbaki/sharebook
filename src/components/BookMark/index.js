import React from 'react';
import './index.css';

const BookMark = (props) => {
    return (
        <div class="bookmark-container">
            <a href={props.bookmark.url}>{props.bookmark.description}</a>
            <div class="tags-list">
                <div class="urlContainer"><span>{props.bookmark.url}</span></div>
                {props.bookmark.tags ?
                    props.bookmark.tags.map((tag) =>
                        <div class="tag"><span>{tag}</span></div>
                    ) : <div />
                }
            </div>
        </div>
    );
}

export default BookMark;
