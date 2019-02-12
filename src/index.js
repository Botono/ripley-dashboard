import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";

import './index.css';
import Overview from './containers/Overview';
import Nav from './components/Nav/Nav';
import * as serviceWorker from './serviceWorker';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Nav />
                    <Route exact path="/" component={Overview} />
                </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
