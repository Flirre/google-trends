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

const colors = {
  blue: '#0000ff',
  red: '#ff0000'
};

class Chart extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      error: false,
      loaded: false
    };
  }

  public fetchData() {
    this.setState({ loaded: false });
    /* tslint:disable */
    fetch(`http://localhost:3001/?searchTerm=${this.props.searchTerm}`)
      .then(results => {
        return results.json();
      })
      .then(jsonResults => {
        jsonResults.message[0]['error'] === 'error'
          ? this.setState({ error: true, loaded: false })
          : this.setState({
              data: jsonResults,
              loaded: true
            });
      });
    /* tslint:enable */
  }

  public componentDidUpdate(prevProps: any) {
    if (
      this.props.searchTerm !== prevProps.searchTerm &&
      this.props.searchTerm !== ''
    ) {
      this.fetchData();
    }
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
          {this.state.loaded ? (
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

              <Line
                type="linear"
                dataKey={this.props.searchTerm}
                dot={false}
                stroke={this.props.color === 'red' ? colors.red : colors.blue}
                strokeWidth={2.3}
              />
            </LineChart>
          ) : (
            <div />
          )}
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Chart;
