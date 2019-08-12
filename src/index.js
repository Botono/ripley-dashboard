import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from "react-router-dom";

import './index.css';
import Login from './components/Login';
import Overview from './containers/Overview';
import Activity from './containers/Activity';
import Logs from './containers/Logs';
import Water from './containers/Water';
import Navigation from './components/Nav/Navigation';
import * as serviceWorker from './serviceWorker';

class App extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <Navigation />
                    <Route exact path="/" component={Overview} />
                    <Route path="/activity" component={Activity} />
                    <Route path="/logs" component={Logs} />
                    <Route path="/water" component={Water} />

                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
