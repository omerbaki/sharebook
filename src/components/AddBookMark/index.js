import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import './index.css';

const handleSubmit = () => {
    console.log(this.refs.url.findDOMNode().value) // from elements property
}

const AddBookMark = (props) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [options, setOptions] = useState([
        { value: 'S3', label: 'S3' },
        { value: 'Auth', label: 'Auth' },
        { value: 'AWS', label: 'AWS' },
    ]);

    const handleChange = option => {
        setSelectedItems( option );
    };    

    const saveChanges = () => {
        props.
        props.onHide();
    }

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                    <div className="form-group">
                        <label>Enter Url</label>
                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                    </div>
                    <div>
                        <Select
                            value={selectedItems}
                            onChange={handleChange}
                            options={options}
                            isMulti={true}
                        />
                    </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.onHide}>
                    Save Changes
          </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddBookMark;
