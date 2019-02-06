import React, { Component } from 'react';
import { isNull, keys } from 'lodash';
import { Container, Row, Col } from 'react-bootstrap';


import Nav from './components/Nav';
import AuthModal from './components/AuthModal';
import ChangelogTable from './components/Changelog/ChangelogTable'
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
    this.initializeData();
  }

  apiKeyMissing = () => {
    let keyMissing = isNull(window.localStorage.getItem('api-key'));
    this.setState({
      show_auth_modal: keyMissing,
    });
    return keyMissing;
  }

  setApiKey = (value) => {
    window.localStorage.setItem('api-key', value);
    setTimeout(this.initializeData, 1500);
  }

  initializeData = () => {
    if (!this.apiKeyMissing()) {
      this.getWaterData();
      this.getChangelogData();
    }
  }

  getWaterData = () => {
    let that = this;
    fetchData('/water')
      .then(function (json_data) {
        that.setState({
          water_data: json_data,
        });
    });
  }

  getChangelogData = () => {
    let that = this;
    fetchData('/changelog')
      .then(function (json_data) {
        that.setState({
          changelog_data: json_data,
        });
      });
  }


  render() {
    return (
      <>
        <Nav />
        <Container fluid className="rootContainer">

          <AuthModal showModal={this.state.show_auth_modal} setApiKey={this.setApiKey} />

          <Row>
            <Col sm={3}>
              <ChangelogTable changelog_data={this.state.changelog_data} />
            </Col>
            <Col sm={9}>
              <Row>
                <Col sm={6}>
                  <div className="chart-wrapper">
                    <div className="chart-title">
                      Activity
                    </div>
                    <div className="chart-stage">
                      <img data-src="holder.js/100%x240/white" />
                    </div>
                    <div className="chart-notes">
                      Notes about this chart
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <WaterSummaryChart
                    getWaterData={this.getWaterData}
                    water_data={this.state.water_data}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </>

    );
  }
}

export default App;
