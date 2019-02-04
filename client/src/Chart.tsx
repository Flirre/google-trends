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
      loaded: false
    };
  }

  public componentDidUpdate(prevProps: any) {
    // hold rendering until prop data is properly in component.
    if (this.props.data !== prevProps.data) {
      this.setState({ loaded: true });
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
              data={this.props.data[this.props.team]}
              margin={{ top: 30, right: 60, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="2 2" />
              <Tooltip />
              <Legend />
              <Line
                type="linear"
                dataKey={'points'}
                dot={false}
                name={`${this.props.term} ${
                  this.props.data[this.props.team][0].term
                }`}
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
