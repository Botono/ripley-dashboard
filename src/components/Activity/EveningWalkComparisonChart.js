import React, { Component } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { isEmpty, keys, takeRight, includes } from 'lodash';
import moment from 'moment';
import sma from 'sma';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import Config from '../../common/config';
import LoadingRefreshButton from '../LoadingRefreshButton';


class EveningWalkComparisonChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chart_data: {},
            days_to_show: 10,
        };
    }

    componentDidUpdate(prevProps) {
        if (isEmpty(prevProps) || keys(prevProps.chart_data).length !== keys(this.props.chart_data).length) {
            this.formatData();
        }
    }

    getBarColor = (value) => {
        if (value <= 500) {
            return Config.palette['red'][6];
        } else if (value > 500 && value < 600) {
            return Config.palette['lime'][6];
        } else if (value >= 600 && value < 1200) {
            return Config.palette['teal'][6];
        } else {
            return Config.palette['blue'][6];
        }
    }

    formatData = () => {
        let { chart_data } = this.props;
        let data_keys = takeRight(keys(chart_data), this.state.days_to_show);
        let labels = [];
        let dataset_data = [];
        let activity_total;
        let tmp_activity;
        let valid_indexes = [16, 17, 18];
        let colors = [];
        let moving_average_data;

        data_keys.forEach((key, date_idx) => { // '2019-02-01'
            labels.push(moment(key).format('MMM D'));
            activity_total = 0;

            for (let i = 0; i < valid_indexes.length; i++) {
                tmp_activity = 0;
                const idx = valid_indexes[i];
                if (chart_data[key][idx]) {
                    tmp_activity += chart_data[key][idx].activity_value;
                    console.log(`Key: ${key} Index: ${idx}} Parsed Value: ${tmp_activity} Raw Value: ${chart_data[key][idx].activity_value}`);
                } else {
                    tmp_activity += 1;
                }

                if (tmp_activity >= 200) {
                    activity_total += tmp_activity;
                    // In case the walk spilled over into the next hour, include it if the value is large enough
                    if (chart_data[key][idx + 1].activity_value >= 100) {
                        activity_total += chart_data[key][idx + 1].activity_value;
                    }
                    break;
                }
            }

            dataset_data.push(activity_total);
            colors.push(this.getBarColor(activity_total));
        });

        moving_average_data = sma(dataset_data, 3);
        moving_average_data.unshift(null, null, null);

        let data = {
            labels: labels,
            datasets: [
                {
                    type: 'line',
                    data: moving_average_data,
                    label: 'Moving Average',
                    borderColor: Config.palette.gray[6],
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                },
                {
                    data: dataset_data,
                    label: 'Evening Walk Activity',
                    borderColor: colors,
                    backgroundColor: colors,
                    borderWidth: 1,
                    fill: false,
                    pointRadius: 3,
                }
            ],
        };

        this.setState(
            {
                chart_data: data
            }
        );
    }

    changeChartNumber = (e) => {
        this.setState({
            days_to_show: parseInt(e.target.value),
        }, this.formatData);
    }

    render() {
        const { loading, refreshData } = this.props;

        return (
            <Card>
                <Card.Header>
                    Evening Walk Activity: Last <Form.Control type="number" step="1" max="30" size="sm" className="input-inline small" value={this.state.days_to_show} onChange={this.changeChartNumber} /> Days
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

export default EveningWalkComparisonChart;