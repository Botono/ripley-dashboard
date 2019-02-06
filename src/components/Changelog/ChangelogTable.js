import React, { Component } from 'react';

import { isEmpty, keys, takeRight } from 'lodash';
import Table from 'react-bootstrap/Table';



class ChangelogTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            table_data: [],
            days_to_show: 10,
        };
    }

    componentDidUpdate(prevProps) {
        if (isEmpty(prevProps) || keys(prevProps.changelog_data).length !== keys(this.props.changelog_data).length) {
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
        return this.state.table_data.map(row => {
            return (
                <tr>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                </tr>
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
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.getTableRows()}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default ChangelogTable;