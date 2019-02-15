import React, { Component } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { isEmpty, keys, takeRight, includes } from 'lodash';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import Config from '../../common/config';


class MorningWalkComparisonChart extends Component {

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
        // {
        //     "2019-02-09": [
        //         {
        //             "activity_goal": 23100,
        //             "activity_value": 587,
        //             "date": "2019-02-09",
        //             "distance_in_miles": 0.07,
        //             "kcalories": 34,
        //             "min_active": 14,
        //             "min_play": 0,
        //             "min_rest": 46,
        //             "time": "00:00:00"
        //         },
        //         {
        //             "activity_goal": 23100,
        //             "activity_value": 30,
        //             "date": "2019-02-09",
        //             "distance_in_miles": 0,
        //             "kcalories": 23,
        //             "min_active": 7,
        //             "min_play": 0,
        //             "min_rest": 53,
        //             "time": "01:00:00"
        //         },
        //     ]
        // }
        let data_keys = takeRight(keys(chart_data), this.state.days_to_show);
        let labels = [];
        let dataset_data = [];
        let activity_total;
        let valid_indexes = [8,9];
        let colors = [];

        data_keys.forEach((key, date_idx) => { // '2019-02-01'
            labels.push(key);
            activity_total = 0;

            valid_indexes.forEach(idx => {
                if (chart_data[key][idx]) {
                    activity_total += Math.max(Math.round(chart_data[key][idx].activity_value / 5.5), 1);
                } else {
                    activity_total += 1;
                }
            });

            dataset_data.push(activity_total);
            colors.push(Config.bar_graph_colors[date_idx])
        });


        let data = {
            labels: labels,
            datasets: [{
                data: dataset_data,
                label: 'Morning Walk Activity',
                borderColor: colors,
                backgroundColor: colors,
                borderWidth: 1,
                fill: false,
                pointRadius: 3,
            }],
        };

        return data;
    }

    render() {
        return (
            <Card>
                <Card.Header>
                    Morning Walk Activity: Last {this.state.days_to_show} Days
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

export default MorningWalkComparisonChart;