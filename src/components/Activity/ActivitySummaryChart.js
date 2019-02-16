import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { isEmpty, keys, takeRight } from 'lodash';
import moment from 'moment';

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
            this.formatChartData();
        }
    }

    changeChartNumber = (e) => {
        this.setState({
            days_to_show: parseInt(e.target.value),
        }, this.formatChartData);
    }

    getBarColor = (value) => {
        if (value <= 3000){
            return Config.palette['red'][6];
        } else if (value > 3000 && value < 4200) {
            return Config.palette['lime'][6];
        } else if (value >= 4200 && value < 6000) {
            return Config.palette['teal'][6];
        } else {
            return Config.palette['blue'][6];
        }
    }

    formatChartData = () => {
        let { chart_data } = this.props;
        let chart_keys = takeRight(keys(chart_data), this.state.days_to_show);

        let labels = [];
        let dataset_data = [];
        let colors = [];

        chart_keys.forEach((key, idx) => {
            labels.push(moment(key).format('MMM D'));
            dataset_data.push(chart_data[key].activity_value);
            colors.push(this.getBarColor(chart_data[key].activity_value));
        });

        let data = {
            labels: labels,
            datasets: [{
                data: dataset_data,
                label: "Daily Activity",
                borderColor: colors,
                backgroundColor: colors,
            },]
        }

        this.setState({
            chart_data: data,
        });
    }

    render() {
        return (
            <Card>
                <Card.Header>
                    Daily Activity: Last <Form.Control type="number" step="1" max="30" size="sm" className="input-inline" value={this.state.days_to_show} onChange={this.changeChartNumber} /> Days
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

export default ActivitySummaryChart;