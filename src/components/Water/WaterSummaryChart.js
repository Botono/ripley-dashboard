import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { isEmpty, keys, takeRight } from 'lodash';
import moment from 'moment';

import Config from '../../common/config';


class WaterSummaryChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            water_chart_data: {},
            days_to_show: 10,
        };
    }

    componentDidUpdate(prevProps) {
        if (isEmpty(prevProps) || keys(prevProps.water_data).length !== keys(this.props.water_data).length ) {
            this.formatWaterData();
        }
    }

    changeChartNumber = (e) => {
        this.setState({
            days_to_show: parseInt(e.target.value),
        }, this.formatWaterData);
    }

    formatWaterData = () => {
        // { "1/11/2019 8:52:28": { "kibble_eaten": true, "note": "", "water": 1606 }, "1/12/2019 8:49:03": { "kibble_eaten": true, "note": "", "water": 1865 }, };

        let water_data = this.props.water_data;
        let water_keys = takeRight(keys(water_data), this.state.days_to_show);
        let labels = [];
        let dataset_data = [];

        water_keys.forEach(key => {
            labels.push(moment(key.split(' ')[0]).format('MMM D'));
            dataset_data.push(water_data[key].water / 1000);
        });

        let data = {
            labels: labels,
            datasets: [{
                data: dataset_data,
                label: "Water Drank",
                borderColor: Config.palette.blue[7],
                fill: true,
                backgroundColor: Config.palette.blue[7],
                pointRadius: 3,
                pointBackgroundColor: Config.palette.blue[5],
            },]
        }

        this.setState({
            water_chart_data: data,
        })
    }

    render() {
        return (
            <Card>
                <Card.Header>
                    Water Consumed: Last <Form.Control type="number" step="1" max="30" size="sm" className="input-inline" value={this.state.days_to_show} onChange={this.changeChartNumber} /> Days
                </Card.Header>
                <Card.Body>
                    <div className="chart-stage">
                        <Line
                            data={this.state.water_chart_data}
                            options={{
                                legend: false,
                                scales: {
                                    yAxes: [{
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Liters'
                                        },
                                        ticks: {
                                            suggestedMax: 2.0,
                                            beginAtZero: true,
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

export default WaterSummaryChart;