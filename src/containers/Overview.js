import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isNull } from 'lodash';
import { Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import AuthModal from '../components/AuthModal';
import ChangelogTable from '../components/Changelog/ChangelogTable'
import WaterSummaryChart from '../components/Water/WaterSummaryChart';
import ActivitySummaryChart from '../components/Activity/ActivitySummaryChart';

import { fetchData, isApiKeyMissing } from '../common/utils'


class Overview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect_to_login: false,
            water_data: {},
            water_data_loading: true,
            changelog_data: [],
            activity_data: {},
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
            this.getWaterData();
            this.getChangelogData();
            this.getActivityData();
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

    getChangelogData = () => {
        let that = this;
        fetchData('/changelog')
            .then(function (json_data) {
                that.setState({
                    changelog_data: json_data,
                });
            });
    }

    getActivityData = () => {
        let that = this,
            params = {
                // startDate: moment().subtract(10, 'd').format('YYYY-MM-DD'),
                // endDate: moment().format('YYYY-MM-DD'),
                numberOfDays: 30,
                resolution: 'daily',
            };

        fetchData('/fitbark/activity', 'GET', params)
            .then(function (json_data) {
                that.setState({
                    activity_data: json_data,
                });
            });
    }


    render() {
        if (this.state.redirect_to_login) {
            return <Redirect to="/login" />
        }

        return (
            <Container fluid className="rootContainer">

                <AuthModal showModal={this.state.show_auth_modal} setApiKey={this.setApiKey} />

                <Row>
                    <Col sm={3}>
                        <ChangelogTable changelog_data={this.state.changelog_data} />
                    </Col>
                    <Col sm={9}>
                        <Row>
                            <Col sm={6}>
                                <ActivitySummaryChart chart_data={this.state.activity_data} />
                            </Col>
                            <Col sm={6}>
                                <WaterSummaryChart
                                    getWaterData={this.getWaterData}
                                    water_data={this.state.water_data}
                                    loading={this.state.water_data_loading}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Overview;
