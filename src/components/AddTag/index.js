import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddTag = (props) => {
    const [tagName, setTagName] = useState('');

    const handleNameChange = e => {
        setTagName(e.target.value);
    }

    const cancelChanges = () => {
        props.onHide();
    }

    const saveChanges = () => {
        const newTag = { name: tagName };        
        props.onSave(newTag);
    }

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" 
                               onChange={handleNameChange} placeholder="" />
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

export default AddTag;
