import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isNull } from 'lodash';
import { Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import ChangelogTable from '../components/Changelog/ChangelogTable'
import WaterSummaryChart from '../components/Water/WaterSummaryChart';
import ActivitySummaryChart from '../components/Activity/ActivitySummaryChart';
import SleepComparisonChart from '../components/Activity/SleepComparisonChart';
import MorningWalkComparisonChart from '../components/Activity/MorningWalkComparisonChart';
import EveningWalkComparisonChart from '../components/Activity/EveningWalkComparisonChart';

import { fetchData, isApiKeyMissing } from '../common/utils'


class Overview extends Component {

    constructor(props) {
        super(props);
        this.dataInterval = null;
        this.state = {
            redirect_to_login: false,
            water_data: {},
            water_data_loading: true,
            activity_data_hourly: {},
            activity_data_daily: {},
            changelog_data: [],
        };
    }

    componentDidMount() {
        this.initializeData();
        this.dataInterval = setInterval(this.initializeData, 1000 * 60 * 60);
    }

    componentWillUnmount() {
        clearInterval(this.dataInterval);
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
            this.getDailyActivity();
            this.getWaterData();
            this.getChangelogData();
        }
    }

    getWaterData = () => {
        let that = this;
        fetchData('/water')
            .then(function (json_data) {
                that.setState({
                    water_data: json_data,
                    water_data_loading: false,
                });
            });
    }

    getHourlyActivity = () => {
        let that = this,
            params = {
                numberOfDays: 30,
                resolution: 'hourly',
            };

        fetchData('/fitbark/activity', 'GET', params)
            .then(function (json_data) {
                that.setState({
                    activity_data_hourly: json_data,
                });
            });
    }

    getDailyActivity = () => {
        let that = this,
            params = {
                numberOfDays: 30,
                resolution: 'daily',
            };

        fetchData('/fitbark/activity', 'GET', params)
            .then(function (json_data) {
                that.setState({
                    activity_data_daily: json_data,
                });
            });
    }

    getChangelogData = () => {
        let that = this;
        fetchData('/changelog')
            .then(function (json_data) {
                that.setState({
                    changelog_data: json_data,
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
                    <Col sm={8}>
                        <Row>
                            <Col sm={6}>
                                <ActivitySummaryChart chart_data={this.state.activity_data_daily} />
                            </Col>
                            <Col sm={6}>
                                <WaterSummaryChart
                                    getWaterData={this.getWaterData}
                                    water_data={this.state.water_data}
                                    loading={this.state.water_data_loading}
                                />
                            </Col>
                        </Row>
                        <Row>

                            <Col sm={6}>
                                <MorningWalkComparisonChart chart_data={this.state.activity_data_hourly} />
                            </Col>
                            <Col sm={6}>
                                <EveningWalkComparisonChart chart_data={this.state.activity_data_hourly} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <SleepComparisonChart chart_data={this.state.activity_data_hourly} />
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={4}>
                        <ChangelogTable changelog_data={this.state.changelog_data} />
                    </Col>
                </Row>

            </Container>
        );
    }
}

export default Overview;
