import React, { Component } from 'react';

import { isEmpty, keys, takeRight } from 'lodash';
import moment from 'moment';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { isNull } from 'util';

import LoadingRefreshButton from '../LoadingRefreshButton';


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
            filtered_data = raw_data.filter(item => item.message.toLowerCase().includes(this.state.data_filter.toLowerCase()), this)
        }

        // filtered_data.sort(this.sortFunc)

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
        let rows = [];
        let current_date = null;
        let last_date = null;
        let card_idx = 0;
        let grouped_messages = [];

        this.state.filtered_data.forEach((row, idx) => {
            let classes = `fa-li fa fa-${msgTypeIconMap[row.type]}`;

            if (isNull(current_date)) {
                current_date = row.date;
            }

            if (row.date !== current_date) {
                rows.push(
                    <Card key={card_idx++}>
                        <Card.Header>
                            {moment(current_date).format('MMMM D, YYYY')}
                        </Card.Header>
                        <Card.Body>
                            <ul className="fa-ul">
                                {grouped_messages}
                            </ul>
                        </Card.Body>
                    </Card>
                );
                grouped_messages = [];
                current_date = row.date;
            }
            last_date = row.date;
            grouped_messages.push(
                <li key={row.messageHash}>
                    <i className={classes}></i>
                    {row.message}
                </li>
            )
        });

        if (grouped_messages.length > 0) {
            console.log();
            rows.push(
                <Card key={card_idx++}>
                    <Card.Header>
                        {moment(last_date).format('MMMM D, YYYY')}
                    </Card.Header>
                    <Card.Body>
                        <ul className="fa-ul">
                            {grouped_messages}
                        </ul>
                    </Card.Body>
                </Card>
            );
        }

        return rows;
    }

    handleFilterChange = (e) => {
        this.setState({
            data_filter: e.target.value,
        }, this.formatChangelogData);
    }

    render() {
        const { loading, refreshData } = this.props;

        return (
            <Card>
                <Card.Header>
                    Changelog&nbsp;
                    <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Filter"
                        className="input-inline"
                        onChange={this.handleFilterChange} />
                    <LoadingRefreshButton
                        loading={loading}
                        clickFunction={refreshData}
                    />
                </Card.Header>
                <Card.Body>
                    <div className="changelog-table">
                        {this.getTableRows()}
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

export default ChangelogTable;