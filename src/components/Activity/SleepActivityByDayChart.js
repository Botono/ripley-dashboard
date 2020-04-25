import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { isEmpty, keys } from 'lodash';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import Config from '../../common/config';
import LoadingRefreshButton from '../LoadingRefreshButton';


export default class SleepActivityByDayChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chart_data: {},
            item_to_chart: '',
        };
    };

    componentDidUpdate(prevProps) {
        if (isEmpty(prevProps) || keys(prevProps.chart_data).length !== keys(this.props.chart_data).length) {
            this.formatData()
        }
    };

    changeChartNumber = (e) => {
        this.setState({
            days_to_show: parseInt(e.target.value),
        }, this.formatData);
    };

    getBarColor = (value) => {
        // if (value >= 30) {
        //     return Config.palette['red'][6];
        // } else if (value >= 20 && value < 30) {
        //     return Config.palette['lime'][6];
        // } else if (value >= 10 && value < 20) {
        //     return Config.palette['teal'][6];
        // } else {
        //     return Config.palette['blue'][6];
        // }
        return Config.palette['blue'][6];
    };

    getTotalSleepActivity = (data) => {
        let totalSleepActivity = 0;

        for (let i = 0; i < data.length; i++) {
            if (i < 8) {
                totalSleepActivity += data[i].activity_value;
            }
        }

        return totalSleepActivity;
    };

    getHourLabel = (hour) => {
        let startHour;
        startHour = hour === 0 ? '12' : hour;

        return `${startHour}AM - ${hour+1}AM`;
    };

    formatData = () => {
        const { chart_data } = this.props;
        let { item_to_chart } = this.state;
        const dateArray = Object.keys(chart_data).sort().reverse();

        if (item_to_chart === '') {
            item_to_chart = dateArray[0];
        }

        const hourlyData = chart_data[item_to_chart];

        let labels = [];
        let datasets = [];
        let dataset_data = [];
        let colors = [];

        for (let i = 0; i < hourlyData.length; i++) {
            if (i < 8) {
                labels.push(this.getHourLabel(i));
                dataset_data.push(hourlyData[i].activity_value);
                colors.push(this.getBarColor(hourlyData[i].activity_value));
            } else {
                break;
            }
        }

        datasets.push({
            data: dataset_data,
            label: item_to_chart,
            borderColor: colors,
            backgroundColor: colors,
        });


        let data = {
            labels: labels,
            datasets: datasets,
        }

        this.setState({
            chart_data: data,
            item_to_chart: item_to_chart,
        });
    };

    getDateOptions = () => {
        const { chart_data } = this.props;
        const dateArray = Object.keys(chart_data).sort().reverse();

        return dateArray.map((chartDate) => {
            return (<option key={chartDate}>{chartDate}</option>)
        });
    };

    changeChartedItem = (e) => {
        this.setState({
            item_to_chart: e.target.value,
        }, this.formatData);
    }

    render() {
        const { loading, refreshData } = this.props;

        return (
            <Card>
                <Card.Header>
                    Sleep Activity by Hour on:
                    <Form.Control
                        size="sm"
                        as="select"
                        className="input-inline"
                        onChange={this.changeChartedItem}>
                        {this.getDateOptions()}
                    </Form.Control>
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
