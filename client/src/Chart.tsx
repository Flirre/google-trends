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
    const { team1, team2 } = this.props.data;
    return (
      <div
        style={{
          backgroundColor: 'white',
          color: 'black',
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
              margin={{ top: 30, right: 60, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="date" allowDuplicatedCategory={false} />

              <YAxis type="number" domain={[0, 100]} />
              <CartesianGrid strokeDasharray="2 2" />
              <Legend
                verticalAlign="top"
                iconSize={16}
                iconType="square"
                wrapperStyle={{
                  top: '15px'
                }}
              />
              <Line
                data={team1}
                type="linear"
                dataKey={'points'}
                dot={false}
                name={`${this.props.term} ${this.props.data.team1[0].term}`}
                stroke={colors.red}
                strokeWidth={2.3}
              />
              <Line
                data={team2}
                type="linear"
                dataKey={'points'}
                dot={false}
                name={`${this.props.term} ${this.props.data.team2[0].term}`}
                stroke={colors.blue}
                strokeWidth={2.3}
              />
              <Tooltip />
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
