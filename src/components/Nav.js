import React, { Component } from 'react';


class Nav extends Component {
    render() {
        return (
            <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="../">
                            <span className="glyphicon glyphicon-chevron-left"></span>
                        </a>
                        <a className="navbar-brand" href="./">Ripley's Dashboard</a>
                    </div>
                    {/* <div className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-left">
                            <li><a href="https://keen.io">Home</a></li>
                            <li><a href="https://keen.io/team">Team</a></li>
                            <li><a href="https://github.com/keenlabs/dashboards/tree/gh-pages/layouts/hero-thirds">Source</a></li>
                            <li><a href="https://groups.google.com/forum/#!forum/keen-io-devs">Community</a></li>
                            <li><a href="http://stackoverflow.com/questions/tagged/keen-io?sort=newest&pageSize=15">Technical Support</a></li>
                        </ul>
                    </div> */}
                </div>
            </div>
        );
    }
}

export default Nav;