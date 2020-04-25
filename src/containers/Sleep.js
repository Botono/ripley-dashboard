import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import SleepActivityTotalChart from '../components/Activity/SleepActivityTotalChart';
import SleepActivityByDayChart from '../components/Activity/SleepActivityByDayChart';

import { isApiKeyMissing, getData } from '../common/utils'


class Sleep extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect_to_login: false,
            activity_data_hourly: {},
            activity_hourly_loading: true,
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
            this.getHourlyActivity();
        }
    }

    getHourlyActivity = () => {
        this.setState({
            activity_hourly_loading: true,
        }, () => {
            this.setState({
                activity_data_hourly: getData('activity_hourly'),
                activity_hourly_loading: false,
            });
        });
    }

    getDailyActivity = () => {
        this.setState({
            activity_daily_loading: true,
        }, () => {
            this.setState({
                activity_data_daily: getData('activity_daily'),
                activity_daily_loading: false,
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
                        <SleepActivityTotalChart
                            chart_data={this.state.activity_data_hourly}
                            loading={this.state.activity_hourly_loading}
                            refreshData={this.getHourlyActivity}
                        />
                    </Col>
                    <Col>
                        <SleepActivityByDayChart
                            chart_data={this.state.activity_data_hourly}
                            loading={this.state.activity_hourly_loading}
                            refreshData={this.getHourlyActivity}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Sleep;
