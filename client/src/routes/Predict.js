import React, { Component } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';

import { FilterContainer, FilterItem, FilterLabel } from '../Styles';

const PredictWrapper = styled.div`
  text-align: left;
`;

class Predict extends Component {
  state = {
    rawData: [],
    data: [],
    reinvestDividend: false,
    initialInvestment: 1000,
    nrOfYears: 30
  };

  calculateYearlyDivident(data) {
    const { initialInvestment, nrOfYears, reinvestDividend } = this.state;
    let investment = initialInvestment;
    let dividentYield = data.Yield / 100;
    const dgrInProcent = data.DGR1yr / 100 + 1;

    return Array(nrOfYears)
      .fill()
      .reduce((acc, _, i) => {
        if (i !== 0) {
          dividentYield = dgrInProcent * dividentYield;
        }

        if (reinvestDividend) {
          investment = investment * (dividentYield + 1);
        }

        const dividend = investment * dividentYield;
        acc.push(Math.round(dividend * 100) / 100);
        return acc;
      }, []);
  }

  calculateGraphData = () => {
    const { rawData } = this.state;
    const predictions = this.calculateYearlyDivident(rawData[0]);

    const graphData = predictions.reduce((acc, current, i) => {
      acc.push({ name: i, [rawData[0].Name]: current });
      return acc;
    }, []);

    this.setState({
      data: graphData
    });
  };

  componentDidMount() {
    const data = this.props.location.state && this.props.location.state.current;
    this.dividendYield = data[0].Yield;

    this.setState(
      {
        rawData: data
      },
      () => this.calculateGraphData()
    );
  }

  handleChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  render() {
    const { data, rawData } = this.state;
    return (
      <PredictWrapper>
        <h1>Predictions</h1>
        <FilterContainer>
          <FilterItem>
            <FilterLabel>
              Initial investment in $
              <input
                type="number"
                name="initialInvestment"
                value={this.state.initialInvestment}
                onChange={this.handleChange}
              />
            </FilterLabel>
          </FilterItem>
          <FilterItem>
            <FilterLabel>
              Reinvest dividend
              <input
                type="checkbox"
                name="reinvestDividend"
                onChange={this.handleChange}
              />
            </FilterLabel>
          </FilterItem>
          <FilterItem>
            <FilterLabel>
              <button
                className="btn btn-primary btn-md"
                onClick={this.calculateGraphData}
              >
                Filter
              </button>
            </FilterLabel>
          </FilterItem>
        </FilterContainer>
        <div>
          initialInvestment: ${this.state.initialInvestment}
          DGR 1yr:
          {rawData[0] && rawData[0].DGR1yr}
          Yield: {rawData[0] && rawData[0].Yield}
        </div>
        <LineChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={rawData[0] && rawData[0].Name}
            stroke="#8884d8"
          />
        </LineChart>
      </PredictWrapper>
    );
  }
}
export default Predict;
// const data = [
//   { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
//   { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
//   { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
//   { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
//   { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
//   { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
//   { name: "Page G", uv: 3490, pv: 4300, amt: 2100 }
// ];
