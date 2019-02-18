import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { isEmpty, keys, takeRight } from 'lodash';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import Config from '../../common/config';


class SleepComparisonChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chart_data: {},
            days_to_show: 10,
        };
    }

    componentDidUpdate(prevProps) {
        if (isEmpty(prevProps) || keys(prevProps.chart_data).length !== keys(this.props.chart_data).length) {
            this.setState(
                {
                    chart_data: this.formatData(this.props.chart_data)
                }
            );
        }
    }

    formatData = (chart_data) => {
        let data_keys = takeRight(keys(chart_data), this.state.days_to_show);
        let labels = [];
        let dataset_data = [];
        let datasets = [];

        data_keys.forEach((key, date_idx) => { // '2019-02-01'
            labels = [];
            dataset_data = [];

            chart_data[key].forEach((dataObj, idx) => {
                if (idx < 8) { // Only midnight to 7AM
                    labels.push(moment(`${key} ${dataObj.time}`).format('h A'));
                    dataset_data.push(Math.max(Math.round(dataObj.activity_value / 5.5), 1));
                }

            });

            datasets.push({
                data: dataset_data,
                label: moment(key).format('MMM D'),
                borderColor: Config.bar_graph_colors[date_idx],
                fill: false,
                borderWidth: 1,
                pointRadius: 3,
            })
        });


        let data = {
            labels: labels,
            datasets: datasets,
        };

        return data;
    }

    render() {
        return (
            <Card>
                <Card.Header>
                    Sleep Activity: Last {this.state.days_to_show} Days
                </Card.Header>
                <Card.Body>
                    <div className="chart-stage">
                        <Line
                            data={this.state.chart_data}
                            options={{
                                scales: {

                                    xAxes: [{
                                        offset: 50,
                                        ticks: { labelOffset: -50,},
                                        gridLines: {
                                            offsetGridLines: true
                                        },
                                    }],
                                    yAxes: [{
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Activity'
                                        },
                                        ticks: {
                                            beginAtZero: true,   // minimum value will be 0.
                                            suggestedMax: 500,
                                        },
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

export default SleepComparisonChart;