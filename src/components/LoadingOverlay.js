import React, { Component } from 'react';


class LoadingOverlay extends Component {

    render() {
        return (
            <div className="loading-wrapper">
                <div className="loading-overlay-wrapper">
                    <div class="spinner-border" role="status"></div>
                    Loading
                </div>
            </div>
        )
    }

}

export default LoadingOverlay;