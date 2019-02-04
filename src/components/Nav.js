import React, { Component } from 'react';


class Nav extends Component {
    render() {
        return (
            <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="../">
                            <span class="glyphicon glyphicon-chevron-left"></span>
                        </a>
                        <a class="navbar-brand" href="./">Ripley's Dashboard</a>
                    </div>
                    {/* <div class="navbar-collapse collapse">
                        <ul class="nav navbar-nav navbar-left">
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