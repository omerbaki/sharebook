import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './index.css';

const AddBookMark = (props) => {
    const [name, setName] = useState('');

    const handleNameChange = e => {
        setName(e.target.value);
    }

    const cancelChanges = () => {
        props.onHide();
    }

    const saveChanges = () => {
        const bookmark = { name: name };        
        props.onSave(bookmark);
    }

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Book</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" 
                               onChange={handleNameChange} />
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
