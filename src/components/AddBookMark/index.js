import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import './index.css';

const AddBookMark = (props) => {
    const [bookmarkUrl, setBookmarkUrl] = useState('');
    const [bookmarkDescription, setBookmarkDescription] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const options = [
        { value: 'S3', label: 'S3' },
        { value: 'Auth', label: 'Auth' },
        { value: 'AWS', label: 'AWS' },
    ];

    const handleChange = option => {
        setSelectedItems( option );
    };    
    const handleUrlChange = e => {
        setBookmarkUrl(e.target.value);
    }
    const handleDescriptionChange = e => {
        setBookmarkDescription(e.target.value);
    }

    const cancelChanges = () => {
        setSelectedItems([]);
        props.onHide();
    }

    const saveChanges = () => {
        const bookmark = { url: bookmarkUrl , description: bookmarkDescription, tags: selectedItems.map(item => item.value)};        
        setSelectedItems([]);
        props.onSave(bookmark);
    }

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                    <div className="form-group">
                        <label>Url</label>
                        <input type="text" className="form-control" 
                               onChange={handleUrlChange} placeholder="https://..." />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" className="form-control" 
                               onChange={handleDescriptionChange} placeholder="Description..." />
                    </div>
                    <div className="form-group">
                        <label>Tags</label>
                        <Select
                            value={selectedItems}
                            onChange={handleChange}
                            options={options}
                            isMulti={true}
                        />
                    </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={cancelChanges}>
                    Close
                </Button>
                <Button variant="primary" onClick={saveChanges}>
                    Save Changes
          </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddBookMark;
