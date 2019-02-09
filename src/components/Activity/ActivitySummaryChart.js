import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { isEmpty, keys, takeRight } from 'lodash';
import Config from '../../common/config';



class ActivitySummaryChart extends Component {

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
                    chart_data: this.formatChartData(this.props.chart_data)
                }
            );
        }
    }

    formatChartData = (chart_data) => {
        // { "1/11/2019 8:52:28": { "kibble_eaten": true, "note": "", "water": 1606 }, "1/12/2019 8:49:03": { "kibble_eaten": true, "note": "", "water": 1865 }, };
        let chart_keys = keys(chart_data);

        let labels = [];
        let dataset_data = [];
        let colors = [];

        chart_keys.forEach((key, idx) => {
            labels.push(key);
            dataset_data.push(chart_data[key].activity_value);
            colors.push(Config.bar_graph_colors[idx]);
        });

        dataset_data = takeRight(dataset_data, this.state.days_to_show);

        let data = {
            labels: labels,
            datasets: [{
                data: dataset_data,
                label: "Daily Activity",
                borderColor: colors,
                backgroundColor: colors,
            },]
        }

        return data;
    }

    render() {
        return (
            <div className="chart-wrapper">
                <div className="chart-title">
                    Daily Activity: Last {this.state.days_to_show} Days
                </div>
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
                <div className="chart-notes">
                    Notes about this chart
                    </div>
            </div>
        );
    }
}

export default ActivitySummaryChart;