import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Landing from './Landing';
import Team from './Team';

enum Types {
  Point,
  Search,
  Trend
}

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.startGame = this.startGame.bind(this);
    this.switch = this.switch.bind(this);
    this.fetchTerm = this.fetchTerm.bind(this);
    this.postTeamTerm = this.postTeamTerm.bind(this);
    this.fullscreenToggle = this.fullscreenToggle.bind(this);
    this.nextRound = this.nextRound.bind(this);
    this.updateType = this.updateType.bind(this);
    this.state = {
      data: {},
      fullscreen: false,
      landing: true,
      points: {},
      ready: 0,
      red: true,
      round: 0,
      term: '',
      type: Types.Point
    };
  }

  public componentWillMount() {
    this.fetchTerm();
  }

  public startGame = () => {
    fetch(`http://localhost:3001/start`).then(() => {
      this.setState({ landing: false });
    });
  };

  public fetchTerm = () => {
    fetch(`http://localhost:3001/term`)
      .then(resTerm => {
        return resTerm.json();
      })
      .then(jsonTerm => {
        this.setState({
          points: jsonTerm.points,
          term: jsonTerm.term
        });
      });
  };

  public postTeamTerm = (team: string, term: string) => {
    return fetch(`http://localhost:3001/term?team=${team}&searchTerm=${term}`, {
      headers: { 'Content-Type': 'text/html' },
      method: 'POST'
    });
  };

  public fetchData() {
    this.setState({ loaded: false });
    fetch(`http://localhost:3001/trend`)
      .then(results => {
        return results.json();
      })
      .then(jsonResults => {
        this.setState({
          data: jsonResults.message,
          error: false,
          loaded: true
        });
      });
  }

  public switch() {
    this.setState({ red: !this.state.red });
  }

  public fullscreenToggle() {
    this.setState({ fullscreen: !this.state.fullscreen });
  }

  public updateType = () => {
    switch (this.state.type) {
      case Types.Search:
        this.fetchData();
        this.setState({ ready: 0, type: Types.Trend });
        break;
      case Types.Trend:
        this.fetchTerm();
        this.setState((prevState: any) => ({
          ready: 0,
          round: prevState.round + 1,
          type: Types.Point
        }));
        break;
      case Types.Point:
        this.setState({
          ready: 0,
          type: Types.Search
        });
        break;
    }
  };

  public nextRound() {
    if (this.state.ready < 1) {
      this.setState((prevState: any) => ({
        ready: prevState.ready + 1
      }));
    } else {
      this.updateType();
    }
  }

  public render() {
    return (
      <div className="container">
        {this.state.landing ? (
          <Landing startGame={this.startGame} />
        ) : (
          <>
            <Team
              className={
                this.state.fullscreen
                  ? 'full-width ' + (this.state.red ? 'visible' : 'hidden')
                  : 'half-width'
              }
              color="red"
              data={this.state.data}
              buttonColor="blue"
              switch={this.switch}
              fullscreen={this.state.fullscreen}
              fullscreenToggle={this.fullscreenToggle}
              points={this.state.points.team1}
              round={this.state.round}
              type={this.state.type}
              term={this.state.term}
              team="team1"
              nextRound={this.nextRound}
              postTeamTerm={this.postTeamTerm}
            />
            <Team
              className={
                this.state.fullscreen
                  ? 'full-width ' + (!this.state.red ? 'visible' : 'hidden')
                  : 'half-width'
              }
              color="blue"
              data={this.state.data}
              buttonColor="red"
              switch={this.switch}
              fullscreen={this.state.fullscreen}
              fullscreenToggle={this.fullscreenToggle}
              points={this.state.points.team2}
              round={this.state.round}
              type={this.state.type}
              term={this.state.term}
              team="team2"
              nextRound={this.nextRound}
              postTeamTerm={this.postTeamTerm}
            />
          </>
        )}
      </div>
    );
  }
}

export default App;
