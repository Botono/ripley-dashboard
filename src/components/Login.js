import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isNull } from 'lodash';

import Config from '../common/config';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            api_key: null,
            key_saved: false,
            key_error: false,
        };
    }

    componentDidMount() {
    }

    updateApiKey = (e) => {
        this.setState({
            api_key: e.target.value,
            key_error: false,
        })
    }

    setApiKey = () => {
        this.checkAPIStatus().then((response) => {
            this.setState({
                key_error: !response.ok,
            });
            window.localStorage.setItem('ripley-dashboard-api-key', this.state.api_key);
            setTimeout(this.getOuttaHere, 500);
        }).catch(() => {
            this.setState({
                key_error: true,
            });
        });
    }

    getOuttaHere = () => {
        this.setState({
            key_saved: true,
        });
    }

    checkAPIStatus = () => {
        const fetchUrl = new URL(Config.api_url + '/status');
        const { api_key } = this.state;


        return fetch(fetchUrl, {
            method: 'GET',
            headers: {
                "x-api-key": api_key,
            },
        });
    }

    render() {
        if (this.state.key_saved) {
            return <Redirect to="/" />
        }

        return (
            <Container fluid className="rootContainer">
                <Row>
                    <Col />

                    <Col sm={6}>
                        <Card>
                            <Card.Header as="h5">Login</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <Form>
                                        <Form.Group controlId="formApiKey">
                                            <Form.Label>
                                                The Key
                                            </Form.Label>
                                            <Form.Control
                                                onChange={this.updateApiKey}
                                                type="text"
                                                placeholder="Give it to me"
                                            />
                                            <Form.Text className="text-muted">
                                                You gotta
                                            </Form.Text>
                                        </Form.Group>
                                    </Form>
                                </Card.Text>
                                <Alert
                                    variant="danger"
                                    show={this.state.key_error}>
                                    Hey! What are you trying to pull?!
                                </Alert>
                                <Button variant="primary" onClick={this.setApiKey}>Save</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col />
                </Row>
            </Container>
        );
    }
}

export default Login;
