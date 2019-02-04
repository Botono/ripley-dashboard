import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { isEmpty, keys, takeRight } from 'lodash';


class WaterSummaryChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            water_chart_data: {},
            days_to_show: 10,
        };
    }

    componentDidMount() {
        this.props.getWaterData();
    }

    componentDidUpdate(prevProps) {
        if (isEmpty(prevProps) || keys(prevProps.water_data).length !== keys(this.props.water_data).length ) {
            this.setState(
                {
                    water_chart_data: this.formatWaterData(this.props.water_data)
                }
            );
        }
    }

    formatWaterData = (water_data) => {
        // { "1/11/2019 8:52:28": { "kibble_eaten": true, "note": "", "water": 1606 }, "1/12/2019 8:49:03": { "kibble_eaten": true, "note": "", "water": 1865 }, };
        let water_keys = keys(water_data);
        let labels = [];
        let dataset_data = [];

        water_keys.forEach(key => {
            labels.push(key.split(' ')[0]);
            dataset_data.push(water_data[key].water / 1000);
        });

        labels = takeRight(labels, this.state.days_to_show);
        dataset_data = takeRight(dataset_data, this.state.days_to_show);

        let data = {
            labels: labels,
            datasets: [{
                data: dataset_data,
                label: "Water Drank",
                borderColor: "#3e95cd",
                fill: true,
                backgroundColor: "#3e95cd",
                pointRadius: 0,
            },]
        }

        return data;
    }

    render() {
        return (
            <div class="chart-wrapper">
                <div class="chart-title">
                    Water Consumed: Last {this.state.days_to_show} Days
                </div>
                <div class="chart-stage">
                    <Line
                        data={this.state.water_chart_data}
                        options={{
                            scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Liters'
                                    }
                                }]
                            }
                        }}
                    />
                </div>
                <div class="chart-notes">
                    Notes about this chart
                    </div>
            </div>
        );
    }
}

export default WaterSummaryChart;