import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import WaterSummaryChart from '../components/Water/WaterSummaryChart';

import { getData, isApiKeyMissing } from '../common/utils'


class Water extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect_to_login: false,
            water_data: {},
            water_data_loading: true,
        };
    }

    componentDidMount() {
        document.title = 'Dashboard: Water';
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
            this.getWaterData();
        }
    }

    getWaterData = () => {
        this.setState({
            water_data_loading: true,
        }, () => {
            this.setState({
                water_data: getData('water'),
                water_data_loading: false,
            });
        });
    }

    render() {
        if (this.state.redirect_to_login) {
            return <Redirect to="/login" />
        }

        return (
            <Container fluid className="rootContainer big-chart">
                <Row>
                    <Col>
                        <WaterSummaryChart
                            water_data={this.state.water_data}
                            loading={this.state.water_data_loading}
                            refreshData={this.getWaterData} />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Water;
