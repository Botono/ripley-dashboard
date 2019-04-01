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
import BloodworkComparisonChart from '../components/Bloodwork/BloodworkComparisonChart';

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
            activity_hourly_loading: true,
            activity_data_daily: {},
            activity_daily_loading: true,
            changelog_data: [],
            changelog_loading: true,
            bloodwork_data: {},
            bloodwork_labels: [],
            bloodwork_loading: true,
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
            this.getBloodworkLabels();
            this.getBloodworkData();
        }
    }

    getWaterData = () => {
        let that = this;
        this.setState({
            water_data_loading: true,
        });
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

        this.setState({
            activity_hourly_loading: true,
        });

        fetchData('/fitbark/activity', 'GET', params)
            .then(function (json_data) {
                that.setState({
                    activity_data_hourly: json_data,
                    activity_hourly_loading: false,
                });
            });
    }

    getDailyActivity = () => {
        let that = this,
            params = {
                numberOfDays: 30,
                resolution: 'daily',
            };

        this.setState({
            activity_daily_loading: true,
        });

        fetchData('/fitbark/activity', 'GET', params)
            .then(function (json_data) {
                that.setState({
                    activity_data_daily: json_data,
                    activity_daily_loading: false,
                });
            });
    }

    getChangelogData = () => {
        let that = this;

        this.setState({
            changelog_loading: true,
        });

        fetchData('/changelog')
            .then(function (json_data) {
                that.setState({
                    changelog_data: json_data,
                    changelog_loading: false,
                });
            });
    }

    getBloodworkData = () => {
        let that = this;

        this.setState({
            bloodwork_loading: true,
        });

        fetchData('/bloodwork')
            .then(function (json_data) {
                that.setState({
                    bloodwork_data: json_data,
                    bloodwork_loading: false,
                });
            });
    }

    getBloodworkLabels = () => {
        let that = this;
        fetchData('/bloodwork/labels')
            .then(function (json_data) {
                that.setState({
                    bloodwork_labels: json_data,
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
                                <ActivitySummaryChart
                                    chart_data={this.state.activity_data_daily}
                                    loading={this.state.activity_daily_loading}
                                    refreshData={this.getDailyActivity}
                                />
                            </Col>
                            <Col sm={6}>
                                <WaterSummaryChart
                                    refreshData={this.getWaterData}
                                    water_data={this.state.water_data}
                                    loading={this.state.water_data_loading}
                                />
                            </Col>
                        </Row>
                        <Row>

                            <Col sm={6}>
                                <MorningWalkComparisonChart
                                    chart_data={this.state.activity_data_hourly}
                                    loading={this.state.activity_hourly_loading}
                                    refreshData={this.getHourlyActivity}
                                />
                            </Col>
                            <Col sm={6}>
                                <EveningWalkComparisonChart
                                    chart_data={this.state.activity_data_hourly}
                                    loading={this.state.activity_hourly_loading}
                                    refreshData={this.getHourlyActivity}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <SleepComparisonChart
                                    chart_data={this.state.activity_data_hourly}
                                    loading={this.state.activity_hourly_loading}
                                    refreshData={this.getHourlyActivity}
                                />
                            </Col>
                            <Col sm={6}>
                                <BloodworkComparisonChart
                                    chart_data={this.state.bloodwork_data}
                                    bloodwork_labels={this.state.bloodwork_labels}
                                    loading={this.state.bloodwork_loading}
                                    refreshData={this.getBloodworkData}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={4}>
                        <ChangelogTable
                            changelog_data={this.state.changelog_data}
                            loading={this.state.changelog_loading}
                            refreshData={this.getChangelogData}
                        />
                    </Col>
                </Row>

            </Container>
        );
    }
}

export default Overview;
