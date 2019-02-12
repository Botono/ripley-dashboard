import React, { Component } from 'react';
import { isNull } from 'lodash';
import { Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import Nav from '../components/Nav/Nav';
import AuthModal from '../components/AuthModal';
import ChangelogTable from '../components/Changelog/ChangelogTable'
import WaterSummaryChart from '../components/Water/WaterSummaryChart';
import ActivitySummaryChart from '../components/Activity/ActivitySummaryChart';

import { fetchData } from '../common/utils'


class Overview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_auth_modal: false,
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
        let keyMissing = isNull(window.localStorage.getItem('api-key'));
        this.setState({
            show_auth_modal: keyMissing,
        });
        return keyMissing;
    }

    setApiKey = (value) => {
        window.localStorage.setItem('api-key', value);
        setTimeout(this.initializeData, 1500);
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
                startDate: moment().subtract(10, 'd').format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD'),
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
