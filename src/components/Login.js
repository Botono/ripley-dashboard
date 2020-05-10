import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isNull } from 'lodash';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            api_key: null,
            key_saved: false,
        };
    }

    componentDidMount() {
    }

    updateApiKey = (e) => {
        this.setState({
            api_key: e.target.value,
        })
    }

    setApiKey = () => {
        window.localStorage.setItem('ripley-dashboard-api-key', this.state.api_key);
        setTimeout(this.getOuttaHere, 500);
    }

    getOuttaHere = () => {
        this.setState({
            key_saved: true,
        });
    }

    render() {
        if (this.state.key_saved) {
            return <Redirect to="/" />
        }

        return (
            <Container fluid className="rootContainer">
                <Row>
                    <Col/>

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
                                                placeholder="Give it to me" />
                                            <Form.Text className="text-muted">
                                                You gotta
                                            </Form.Text>
                                        </Form.Group>
                                    </Form>
                                </Card.Text>
                                <Button variant="primary" onClick={this.setApiKey}>Save</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col/>
                </Row>
            </Container>
        );
    }
}

export default Login;
