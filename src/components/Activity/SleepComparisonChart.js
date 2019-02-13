import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { isEmpty, keys, takeRight } from 'lodash';

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
        let datasets = [];

        data_keys.forEach((key, date_idx) => { // '2019-02-01'
            labels = [];
            dataset_data = [];

            chart_data[key].forEach((dataObj, idx) => {
                if (idx < 8) { // Only midnight to 7AM
                    labels.push(dataObj.time);
                    dataset_data.push(Math.max(Math.round(dataObj.activity_value / 5.5), 1));
                }

            });

            datasets.push({
                data: dataset_data,
                label: key,
                borderColor: Config.bar_graph_colors[date_idx],
                fill: false,
                pointRadius: 3,
                tension: 0.2,
            })
        });


        let data = {
            labels: labels,
            datasets: datasets,
        };
        console.dir(data);
        return data;
    }

    render() {
        return (
            <div className="chart-wrapper">
                <div className="chart-title">
                    Sleep Activity: Last {this.state.days_to_show} Days
                </div>
                <div className="chart-stage">
                    <Line
                        data={this.state.chart_data}
                        options={{
                            scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Activity'
                                    },
                                    ticks: {
                                        beginAtZero: true,   // minimum value will be 0.
                                        suggestedMax: 500,
                                    }
                                }]
                            }
                        }}
                    />
                </div>
                <div className="chart-notes">
                    Notes about this chart
                </div>
            </div>
        );
    }
}

export default SleepComparisonChart;