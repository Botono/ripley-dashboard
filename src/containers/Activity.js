import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import SleepDisruptionFactorChart from '../components/Activity/SleepDisruptionFactorChart';
import MorningWalkComparisonChart from '../components/Activity/MorningWalkComparisonChart';

import { getData, isApiKeyMissing } from '../common/utils'


class Activiy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect_to_login: false,
            hourly_data: {},
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
            this.getHourlyActivity();
            // this.getDailyActivity();
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
            <Container fluid className="rootContainer">
                <Row>
                    <Col sm={6}>
                        <SleepDisruptionFactorChart chart_data={this.state.hourly_data} />
                    </Col>
                    <Col sm={6}>
                        <MorningWalkComparisonChart
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

export default Activiy;
