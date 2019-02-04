import React, { Component } from 'react';

import Nav from './components/Nav';

class App extends Component {
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
