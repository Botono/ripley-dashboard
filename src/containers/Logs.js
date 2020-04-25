import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import ChangelogTable from '../components/Changelog/ChangelogTable';

import { getData, isApiKeyMissing } from '../common/utils'


class Logs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect_to_login: false,
            changelog_data: [],
            changelog_loading: true,
        };
    }

    componentDidMount() {
        document.title = 'Dashboard: Changelog';
        this.initializeData();
    }

    apiKeyMissing = () => {
        let keyMissing = isApiKeyMissing();
        this.setState({
            redirect_to_login: keyMissing,
        });
        return keyMissing;
    }

    initializeData = () => {
        if (!this.apiKeyMissing()) {
            this.getChangelogData();
            // this.getDailyData();
        }
    }

    getChangelogData = () => {
        this.setState({
            changelog_loading: true,
        }, () => {
            this.setState({
                changelog_data: getData('changelog'),
                changelog_loading: false,
            });
        });
    }

    render() {
        if (this.state.redirect_to_login) {
            return <Redirect to="/login" />
        }

        return (
            <Container fluid className="rootContainer">
                <Row>
                    <Col>
                        <ChangelogTable
                            changelog_data={this.state.changelog_data}
                            loading={this.state.changelog_loading}
                            refreshData={this.getChangelogData}/>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Logs;
