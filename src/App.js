import React, { Component } from 'react';
import { isEmpty, keys } from 'lodash';


import Nav from './components/Nav';
import WaterSummaryChart from './components/Water/WaterSummaryChart';

import Config from './common/config';
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      water_data: {},
    };
  }

  componentDidMount() {

  }

  getWaterData = () => {
    let that = this;

    fetch(Config.api_url + '/water')
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        that.setState({
          water_data: myJson,
        });
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
                <div class="col-sm-6">
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
                <div class="col-sm-6">
                  <WaterSummaryChart
                    getWaterData={this.getWaterData}
                    water_data={this.state.water_data}
                  />
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
