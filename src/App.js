import React, { Component } from 'react';
import { isEmpty, keys } from 'lodash';


import Nav from './components/Nav';
import AuthModal from './components/AuthModal';
import WaterSummaryChart from './components/Water/WaterSummaryChart';

import Config from './common/config';
import { fetchData } from './common/utils'
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_auth_modal: false,
      water_data: {},
    };
  }

  componentDidMount() {
    this.checkApiKey();
  }

  checkApiKey = () => {
    if (window.localStorage.getItem('api-key') === '') {
      this.setState({
        show_auth_modal: true,
      });
    }
  }

  setApiKey = (value) => {
    debugger;
    window.localStorage.setItem('api-key', value);
    this.checkApiKey();
  }

  getWaterData = () => {
    let theData = fetchData('/water');

    this.setState({
      water_data: theData,
    });
  }


  render() {
    return (
      <div>
        <Nav />

        <AuthModal show={this.state.show_auth_modal} setApiKey={this.setApiKey} />

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
