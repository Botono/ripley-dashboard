import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';



class LoadingRefreshButton extends Component {

    render() {
        const { loading, clickFunction } = this.props;
        let refreshClasses;

        if (loading) {
            refreshClasses = 'fas fa-spin fa-sync-alt';
        } else {
            refreshClasses = 'fas fa-sync-alt';
        }

        return (
            <Button variant="light" className="align-right" onClick={clickFunction}>
                <i className={refreshClasses}></i>
            </Button>
        );
    }
}


export default LoadingRefreshButton;

