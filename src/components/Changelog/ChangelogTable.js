import React, { Component } from 'react';

import { isEmpty, keys, takeRight } from 'lodash';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';



class ChangelogTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            table_data: [],
            days_to_show: 10,
        };
    }

    componentDidUpdate(prevProps) {
        if (isEmpty(prevProps) || prevProps.changelog_data.length !== this.props.changelog_data.length) {
            this.setState(
                {
                    table_data: this.formatChangelogData(this.props.changelog_data)
                }
            );
        }
    }

    sortFunc = (a, b) => {
        if (a[0] > b[0])
            return -1;
        if (a[0] < b[0])
            return 1;
        return 0;
    }

    formatChangelogData = (changelog_data) => {
        changelog_data.sort(this.sortFunc)
        return changelog_data;
    }

    getTableRows = () => {
        const msgTypeIconMap = {
            Diet: 'utensils',
            Medicine: 'prescription',
            Other: 'question',
        };
        return this.state.table_data.map((row, idx) => {
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

    render() {
        return (
            <div className="chart-wrapper changelog-table">
                <div className="chart-title">
                    Changelog
                </div>
                <div className="chart-stage">

                    {this.getTableRows()}

                </div>
            </div>
        );
    }
}

export default ChangelogTable;