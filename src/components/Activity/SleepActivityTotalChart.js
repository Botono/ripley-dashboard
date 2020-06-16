import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { isEmpty, keys, takeRight } from 'lodash';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import Config from '../../common/config';
import LoadingRefreshButton from '../LoadingRefreshButton';


export default class SleepActivityTotalChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chart_data: {},
            days_to_show: 10,
        };
    }

    componentDidUpdate(prevProps) {
        if (isEmpty(prevProps) || keys(prevProps.chart_data).length !== keys(this.props.chart_data).length) {
            this.formatData()
        }
    }

    changeChartNumber = (e) => {
        this.setState({
            days_to_show: parseInt(e.target.value),
        }, this.formatData);
    }

    getBarColor = (value) => {
        if (value >= 400) {
            return Config.palette['red'][6];
        } else if (value > 300 && value < 4) {
            return Config.palette['lime'][6];
        } else if (value >= 200 && value < 3) {
            return Config.palette['teal'][6];
        } else {
            return Config.palette['blue'][6];
        }
    }

    getTotalSleepActivity = (data) => {
        let totalSleepActivity = 0;

        for (let i = 0; i < data.length; i++) {
            if (i < 7) {
                totalSleepActivity += data[i].activity_value;
            }
        }

        return totalSleepActivity;
    }

    formatData = () => {
        const { chart_data } = this.props;
        let data_keys = takeRight(keys(chart_data), this.state.days_to_show);
        let labels = [];
        let colors = [];
        let dataset_data = [];

        data_keys.forEach((key, idx) => {
            const totalSleepActivity = this.getTotalSleepActivity(chart_data[key]);
            labels.push(moment(key).format('MMM D'));
            dataset_data.push(totalSleepActivity);
            colors.push(this.getBarColor(totalSleepActivity));
        });

        let data = {
            labels: labels,
            datasets: [{
                data: dataset_data,
                label: "Sleep Activity",
                borderColor: colors,
                backgroundColor: colors,
            },]
        }

        this.setState({
            chart_data: data,
        })
    }

    render() {
        const { loading, refreshData } = this.props;

        return (
            <Card>
                <Card.Header>
                    Sleep Activity Totals:  Last &nbsp;
                    <Form.Control type="number" step="1" size="sm" className="input-inline small" value={this.state.days_to_show} onChange={this.changeChartNumber} /> &nbsp;
                    Days
                    <LoadingRefreshButton
                        loading={loading}
                        clickFunction={refreshData}
                    />
                </Card.Header>
                <Card.Body>
                    <div className="chart-stage">
                        <Bar
                            data={this.state.chart_data}
                            options={{
                                legend: false,
                                scales: {
                                    yAxes: [{
                                        display: true,
                                        ticks: {
                                            beginAtZero: true   // minimum value will be 0.
                                        }
                                    }]
                                }
                            }}
                        />
                    </div>
                </Card.Body>
            </Card>
        );
    }
}
