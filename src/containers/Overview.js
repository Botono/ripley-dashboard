import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import ChangelogTable from '../components/Changelog/ChangelogTable'
import WaterSummaryChart from '../components/Water/WaterSummaryChart';
import ActivitySummaryChart from '../components/Activity/ActivitySummaryChart';
import SleepActivityByDayChart from '../components/Activity/SleepActivityByDayChart';
import SleepActivityTotalChart from '../components/Activity/SleepActivityTotalChart';
import MorningWalkComparisonChart from '../components/Activity/MorningWalkComparisonChart';
import EveningWalkComparisonChart from '../components/Activity/EveningWalkComparisonChart';
import BloodworkComparisonChart from '../components/Bloodwork/BloodworkComparisonChart';

import { isApiKeyMissing, getData } from '../common/utils'


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
        this.setState({
            water_data_loading: true,
        }, () => {
            const waterData = getData('water');
            this.setState({
                water_data: waterData,
                water_data_loading: false,
            });
        });
    }

    getHourlyActivity = () => {
        this.setState({
            activity_hourly_loading: true,
        }, () => {
            const hourlyData = getData('activity_hourly');
            this.setState({
                activity_data_hourly: hourlyData,
                activity_hourly_loading: false,
            });
        });
    }

    getDailyActivity = () => {
        this.setState({
            activity_daily_loading: true,
        }, () => {
            const dailyData = getData('activity_daily')
            this.setState({
                activity_data_daily: dailyData,
                activity_daily_loading: false,
            });
        });
    }

    getChangelogData = () => {
        this.setState({
            changelog_loading: true,
        }, () => {
            const changelogData = getData('changelog')
            this.setState({
                changelog_data: changelogData,
                changelog_loading: false,
            });
        });
    }

    getBloodworkData = () => {
        this.setState({
            bloodwork_loading: true,
        }, () => {
            const bloodworkData = getData('bloodwork');
            this.setState({
                bloodwork_data: bloodworkData,
                bloodwork_loading: false,
            });
        });
    }

    getBloodworkLabels = () => {
        const labelData = getData('bloodwork_labels')
        this.setState({
            bloodwork_labels: labelData,
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
                                <SleepActivityTotalChart
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
                        <Row>
                            <Col sm={6}>
                                <SleepActivityByDayChart
                                    chart_data={this.state.activity_data_hourly}
                                    loading={this.state.activity_hourly_loading}
                                    refreshData={this.getHourlyActivity}
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
