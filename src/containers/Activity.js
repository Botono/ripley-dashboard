import React, { Component } from 'react';
import { isNull } from 'lodash';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import SleepComparisonChart from '../components/Activity/SleepComparisonChart';

import { fetchData, isApiKeyMissing } from '../common/utils'


class Activiy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect_to_login: false,
            hourly_data: {},
            daily_data: {},
        };
    }

    componentDidMount() {
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
            this.getHourlyData();
            // this.getDailyData();
        }
    }

    getHourlyData = () => {
        let that = this,
            params = {
                numberOfDays: 30,
                resolution: 'hourly',
            };

        fetchData('/fitbark/activity', 'GET', params)
            .then(function (json_data) {
                that.setState({
                    hourly_data: json_data,
                });
            });
    }

    getDailyData = () => {
        let that = this,
            params = {
                numberOfDays: 30,
                resolution: 'daily',
            };

        fetchData('/fitbark/activity', 'GET', params)
            .then(function (json_data) {
                that.setState({
                    daily_data: json_data,
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
                        <SleepComparisonChart chart_data={this.state.hourly_data} />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Activiy;
