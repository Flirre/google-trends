import * as React from 'react';
import { Button, Input } from 'semantic-ui-react';
import Chart from './Chart';

enum Types {
  Point,
  Search,
  Trend
}

interface ITeamState {
  error: boolean;
  inputSearchTerm: string;
  name: string;
  prevProps: ITeamProps;
  ready: number;
  score: number;
  searchTerm: string;
}

interface ITeamProps {
  buttonColor: string;
  className: string;
  color: string;
  data: any;
  loaded: boolean;
  nextRound: () => void;
  points: number;
  postTeamTerm: (team: string, term: string) => void;
  ready: number;
  round: number;
  setWait: (waiting: boolean) => void;
  team: string;
  term: string;
  type: Types;
  waiting: boolean;
}

class Team extends React.Component<ITeamProps, ITeamState> {
  public static getDerivedStateFromProps(
    nextProps: ITeamProps,
    prevState: ITeamState
  ) {
    if (
      nextProps.type !== prevState.prevProps.type &&
      nextProps.round === prevState.prevProps.round
    ) {
      return {
        prevProps: nextProps
      };
    } else if (nextProps.round > prevState.prevProps.round) {
      return {
        inputSearchTerm: '',
        prevProps: nextProps,
        searchTerm: ''
      };
    }
    return null;
  }

  constructor(props: ITeamProps) {
    super(props);
    this.setName = this.setName.bind(this);
    this.signalReady = this.signalReady.bind(this);
    this.state = {
      error: false,
      inputSearchTerm: '',
      name: `Team ${this.props.color}`,
      prevProps: props,
      ready: 0,
      score: 0,
      searchTerm: ''
    };
  }

  public componentDidUpdate(prevProps: ITeamProps, prevState: ITeamState) {
    if (
      prevProps !== this.props &&
      this.props.round === 1 &&
      this.state.name === `Team ${this.props.color}`
    ) {
      this.setName(`Team ${prevProps.term} ${prevState.searchTerm}`);
      this.setState({ score: 0 });
    }
  }

  public setName(newName: string) {
    this.setState({ name: newName });
  }

  public onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputSearchTerm: e.target.value });
  };

  public keyPress = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      this.updateSearchTerm();
    }
  };

  public updateSearchTerm = () => {
    if (this.state.inputSearchTerm !== '') {
      this.setState({ searchTerm: this.state.inputSearchTerm }, () => {
        this.props.postTeamTerm(this.props.team, this.state.searchTerm);
      });
    }
  };

  public signalReady() {
    this.props.setWait(true);
    this.props.nextRound();
  }

  // TODO: Break apart Types into separate components
  public render() {
    return (
      <div className={`${this.props.color} player ${this.props.className}`}>
        <h2 className="round">
          TERM {this.props.term && this.props.term.toUpperCase()}
        </h2>
        {this.props.ready !== 1 || !this.props.waiting ? (
          <>
            {' '}
            {!(this.props.type === Types.Search) ? (
              <Button className="next" onClick={this.signalReady} content=">" />
            ) : null}
            {this.props.type === Types.Point ? (
              <React.Fragment>
                <div className="teamContainer">
                  <div className="middle center">
                    <h1 className="teamName">
                      {this.state.name.toUpperCase()}
                    </h1>

                    <h2>{this.props.points} POINTS</h2>
                  </div>
                </div>
              </React.Fragment>
            ) : null}
            {this.props.type === Types.Search ? (
              <React.Fragment>
                <div className="chart-container">
                  <div className="input">
                    <Input
                      action={
                        <Button icon="search" onClick={this.updateSearchTerm} />
                      }
                      placeholder="Enter a search term"
                      onChange={this.onInputChange}
                      onKeyDown={this.keyPress}
                    />
                  </div>
                </div>
                />
              </React.Fragment>
            ) : null}
            {this.props.type === Types.Trend ? (
              <React.Fragment>
                <div className="chart-container">
                  <div className="chart">
                    <Chart
                      data={this.props.data}
                      color={this.props.color}
                      loaded={this.props.loaded}
                      team={this.props.team}
                      term={this.props.term}
                    />
                  </div>
                </div>
              </React.Fragment>
            ) : null}{' '}
          </>
        ) : (
          <>
            <div className="teamContainer">
              <h3 className="center">Waiting for other player..</h3>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Team;
