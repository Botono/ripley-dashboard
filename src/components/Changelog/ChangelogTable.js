import React, { Component } from 'react';

import { isEmpty, keys, takeRight } from 'lodash';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';



class ChangelogTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filtered_data: [],
            raw_data: [],
            days_to_show: 10,
            data_filter: '',
        };
    }

    componentDidUpdate(prevProps) {
        if (isEmpty(prevProps) || prevProps.changelog_data.length !== this.props.changelog_data.length) {
            this.setState({
                    raw_data: this.props.changelog_data
                }, this.formatChangelogData);
        }
    }

    sortFunc = (a, b) => {
        if (a[0] > b[0])
            return -1;
        if (a[0] < b[0])
            return 1;
        return 0;
    }

    formatChangelogData = () => {
        let { raw_data } = this.state;
        let filtered_data = [];

        if (this.state.data_filter === '') {
            filtered_data = raw_data;
        } else {
            filtered_data = raw_data.filter(item => item[2].toLowerCase().includes(this.state.data_filter.toLowerCase()), this)
        }

        filtered_data.sort(this.sortFunc)

        this.setState(
            {
                filtered_data: filtered_data
            }
        );
    }

    getTableRows = () => {
        const msgTypeIconMap = {
            Diet: 'utensils',
            Medicine: 'prescription',
            Other: 'question',
        };
        return this.state.filtered_data.map((row, idx) => {
            let classes = `fas fa-${msgTypeIconMap[row[1]]}`;

            return (
                <Card key={idx}>
                    <Card.Header>
                        <i className={classes}></i>&nbsp;
                        {row[0]}
                    </Card.Header>
                    <Card.Body>
                        {row[2]}
                    </Card.Body>
                </Card>
            )
        });
    }

    handleFilterChange = (e) => {
        this.setState({
            data_filter: e.target.value,
        }, this.formatChangelogData);
    }

    render() {
        return (
            <div className="chart-wrapper ">
                <div className="chart-title">
                    Changelog
                </div>
                <div className="changelog-table">
                    <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Filter"
                        onChange={this.handleFilterChange} />
                    {this.getTableRows()}

                </div>
            </div>
        );
    }
}

export default ChangelogTable;