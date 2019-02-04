import React, { Component } from 'react';

import Nav from './components/Nav';

class App extends Component {

  componentDidMount() {
    fetch('https://0fjc71o959.execute-api.us-west-1.amazonaws.com/v1/fitbark/activity?startDate=2019-01-22&endDate=2019-01-23&resolution=daily', {
      mode: "cors",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        console.log(JSON.stringify(myJson));
      });
  }
  render() {
    return (
      <div>
        <Nav />
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-3">
              <div class="chart-wrapper">
                <div class="chart-title">
                  Side Bar Title
                </div>
                <div class="chart-stage">
                  <img data-src="holder.js/100%x650/white" />
                </div>
                <div class="chart-notes">
                  Notes about this chart
                </div>
              </div>
            </div>
            <div class="col-sm-9">
              <div class="row">
                <div class="col-sm-12">
                  <div class="chart-wrapper">
                    <div class="chart-title">
                      Activity
                    </div>
                    <div class="chart-stage">
                      <img data-src="holder.js/100%x240/white" />
                    </div>
                    <div class="chart-notes">
                      Notes about this chart
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <div class="chart-wrapper">
                    <div class="chart-title">
                      Water
                    </div>
                    <div class="chart-stage">
                      <img data-src="holder.js/100%x240/white" />
                    </div>
                    <div class="chart-notes">
                      Notes about this chart
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default App;
