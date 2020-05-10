import React, { Component } from 'react';
import { Line, Chart } from 'react-chartjs-2';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { isEmpty, keys, takeRight, isUndefined } from 'lodash';
import moment from 'moment';
import { ExportToCsv } from 'export-to-csv';

import Config from '../../common/config';
import { hexToRgbA } from '../../common/utils';
import { drawRectPlugin } from '../../common/chartPlugins';
import LoadingRefreshButton from '../LoadingRefreshButton';



class WaterSummaryChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            water_chart_data: {},
            days_to_show: 10,
        };
    }

    componentDidMount() {
        Chart.plugins.register(drawRectPlugin);
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

    exportCSV = () => {
        const { water_data } = this.props;
        const options = {
            filename: 'ripley_water_data',
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: true,
            title: 'Ripley Water Data',
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
        };
        const csvExporter = new ExportToCsv(options);

        let water_rows = [];
        for (const date in water_data) {
            let row_obj = {
                date: date,
                ...water_data[date]
            }
            water_rows.push(row_obj)
        }

        csvExporter.generateCsv(water_rows);
    }

    formatWaterData = () => {
        // { "1/11/2019 8:52:28": { "kibble_eaten": true, "note": "", "water": 1606 }, "1/12/2019 8:49:03": { "kibble_eaten": true, "note": "", "water": 1865 }, };

        let water_data = this.props.water_data;
        let labels = [];
        let dataset_data = [];

        for (let i = this.state.days_to_show-1; i >= 0; i--) {
            const theDate = moment().subtract(i, 'days');
            const waterObj = water_data[theDate.format('YYYY-MM-DD')];
            labels.push(theDate.format('MMM D'));
            if (isUndefined(waterObj)) {
                dataset_data.push(null);
            } else {
                dataset_data.push(waterObj.water / 1000);
            }

        }

        console.log(Config.palette.blue[7]);

        let data = {
            labels: labels,
            datasets: [{
                data: dataset_data,
                label: "Water Drank",
                borderColor: Config.palette.blue[7],
                fill: 'origin',
                backgroundColor: hexToRgbA(Config.palette.blue[7], 0.5),
                fillOpacity: 0.1,
                pointRadius: 3,
                pointBackgroundColor: Config.palette.blue[5],
            },],
            yHighlightRange: {
                upper: 1.63,
                lower: 0.81,
            }
        }

        this.setState({
            water_chart_data: data,
        })
    }

    render() {
        const { loading, refreshData } = this.props;

        return (
            <Card>
                <Card.Header>
                    Water Consumed: Last &nbsp;
                    <Form.Control type="number" step="1" size="sm" className="input-inline small" value={this.state.days_to_show} onChange={this.changeChartNumber} /> &nbsp;
                    Days
                    <LoadingRefreshButton
                        loading={loading}
                        clickFunction={refreshData}
                    />
                </Card.Header>
                <Card.Body>
                    <div className="chart-stage">
                        <Line
                            data={this.state.water_chart_data}
                            options={{
                                legend: false,
                                responsive: true,
                                aspectRatio: 0.5,

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
                    <div className="d-flex justify-content-center">
                        <Button
                            onClick={this.exportCSV}
                            size="sm"
                            variant="link"
                        >
                            Download
                        </Button>
                    </div>

                </Card.Body>
            </Card>
        );
    }
}

export default WaterSummaryChart;