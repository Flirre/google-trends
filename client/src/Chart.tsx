import * as React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

class Chart extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      loaded: false
    };
  }

  public fetchData() {
    /* tslint:disable */
    console.log('gogogo');
    fetch('http://localhost:3001')
      .then(results => {
        return results.json();
      })
      .then(jsonResults => {
        this.setState({
          data: jsonResults,
          loaded: true
        });
      });
    /* tslint:enable */
  }

  public componentDidMount() {
    this.fetchData();
  }

  public render() {
    return (
      <div
        style={{
          backgroundColor: 'white',
          height: '100%',
          margin: '0 auto',
          width: '75%'
        }}
      >
        <ResponsiveContainer>
          <LineChart
            width={450}
            height={300}
            data={this.state.data.message}
            margin={{ top: 30, right: 60, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="2 2" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Chart;
