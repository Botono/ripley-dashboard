import React, { Component } from 'react';
import { Bar, Chart } from 'react-chartjs-2';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { isEmpty, keys, isNull } from 'lodash';
import moment from 'moment';

import Config from '../../common/config';
import { drawRectPlugin } from '../../common/chartPlugins';
import LoadingRefreshButton from '../LoadingRefreshButton';


class BloodworkComparisonChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chart_data: {},
            item_to_chart: '',
            chart_max: null,
        };
    }

    componentWillMount() {
        Chart.plugins.register(drawRectPlugin);
    }

    componentDidUpdate(prevProps) {
        if (isEmpty(prevProps) || keys(prevProps.chart_data).length !== keys(this.props.chart_data).length) {
            this.formatChartData();
        }
    }

    changeChartedItem = (e) => {
        this.setState({
            item_to_chart: e.target.value,
        }, this.formatChartData);
    }

    getBarColor = (value, label_obj) => {

        if (value <= label_obj.lower || value >= label_obj.upper) {
            return Config.palette['red'][6];
        } else {
            return Config.palette['teal'][6];
        }
    }

    getLabelObject = (label) => {
        let result = null;
        let { bloodwork_labels } = this.props;

        for (const bloodwork_label of bloodwork_labels) {
            if (bloodwork_label.name === label) {
                result = bloodwork_label;
                break;
            }
        }
        return result;
    }

    formatChartData = () => {
        let { chart_data, bloodwork_labels } = this.props;
        let { item_to_chart } = this.state;
        if (item_to_chart === '' && bloodwork_labels) {
            item_to_chart = bloodwork_labels[0].name;
        }
        let item_obj = this.getLabelObject(item_to_chart);

        let chart_keys = keys(chart_data);

        let labels = [];
        let datasets = [];
        let dataset_data = [];
        let colors = [];

        chart_keys.forEach(panel_date => {
            labels.push(moment(panel_date).format('MMM D YYYY'));
            dataset_data.push(chart_data[panel_date][item_to_chart]);
            colors.push(this.getBarColor(chart_data[panel_date][item_to_chart], item_obj));
        });

        datasets.push({
            data: dataset_data,
            label: item_to_chart,
            borderColor: colors,
            backgroundColor: colors,
        });


        let data = {
            labels: labels,
            datasets: datasets,
            yHighlightRange: {
                upper: item_obj.upper,
                lower: item_obj.lower,
            }
        }

        this.setState({
            chart_data: data,
            item_to_chart: item_to_chart,
            chart_max: item_obj.upper * 1.10,
        });
    }

    getBloodworkOptions = () => {
        const { bloodwork_labels} = this.props;
        const labels = bloodwork_labels || [];

        return labels.map((label_obj, idx) => {
            return (<option key={idx}>{label_obj.name}</option>)
        });
    }

    render() {
        const { loading, refreshData } = this.props;

        let chart_options = {
            legend: false,
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true   // minimum value will be 0.
                    }
                }]
            },
            annotation: {},
        };

        if (!isNull(this.state.chart_max)) {
            chart_options.scales.yAxes[0].ticks['suggestedMax'] = this.state.chart_max;
        }

        return (
            <Card>
                <Card.Header>
                    Bloodwork &nbsp;
                    <Form.Control
                        size="sm"
                        as="select"
                        className="input-inline"
                        onChange={this.changeChartedItem}>
                        {this.getBloodworkOptions()}
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
                            options={chart_options}
                        />
                    </div>
                </Card.Body>
            </Card>

        );
    }
}

export default BloodworkComparisonChart;