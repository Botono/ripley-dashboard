import React, { Component } from 'react';

import { Form, Modal, Button } from 'react-bootstrap';


class AuthModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            api_key: '',
        }
    }

    updateApiKey = (e) => {
        this.setState({
            api_key: e.target.value,
        })
    }

    saveApiKey = () => {
        this.props.setApiKey(this.state.api_key);
    }

    render() {
        return(
            <Modal.Dialog show={this.props.show}>
                <Modal.Header closeButton>
                    <Modal.Title>API Key</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formApiKey">
                            <Form.Label>The Key</Form.Label>
                            <Form.Control
                                onChange={this.updateApiKey}
                                type="text"
                                placeholder="Give it to me" />
                            <Form.Text className="text-muted">
                                You gotta
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={this.saveApiKey}>Save</Button>
                </Modal.Footer>
            </Modal.Dialog>
        );

    }
}

export default AuthModal;

