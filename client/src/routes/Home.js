import React, { Component } from 'react';

import Table from '../components/Table';

class Home extends Component {
  state = {
    response: {},
    avgYield: 0
  };

  componentDidMount() {
    this.callApi()
      .then(data => this.setState({ response: data }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch("/api/table");
    const body = await response.json();

    if (response.status !== 200) throw Error(body);

    return body;
  };

  handleChange = event => {
    this.setState({ avgYield: event.target.value });
  };

  render() {
    if (!this.state.response.data) return null;
    const array = this.state.response.data;
    return (
      <div className="Home">
        <form onSubmit={this.handleSubmit}>
          <div className="yieldInput">
            <label>
              <a
                target="_blank"
                href="http://www.multpl.com/s-p-500-dividend-yield/"
              >
                Market average yield:
              </a>
              <input type="number" onChange={this.handleChange} />
            </label>
          </div>
        </form>
        <Table data={array} avgYield={this.state.avgYield} />
      </div>
    );
  }
}

export default Home;