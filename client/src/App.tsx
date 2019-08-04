import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import * as io from 'socket.io-client';
import './App.css';
import EndScreen from './EndScreen';
import Landing from './Landing';
import Team from './Team';

enum Types {
  Point,
  Search,
  Trend
}

interface IAppState {
  data: object;
  gameOver: boolean;
  landing: boolean;
  loaded: boolean;
  points: IPoints;
  ready: number;
  red: boolean;
  round: number;
  team: string;
  term: string;
  type: Types;
  waiting: boolean;
}

interface IPoints {
  team1: number;
  team2: number;
}

class App extends React.Component<{}, IAppState> {
  private socket: SocketIOClient.Socket;

  constructor(props: {}) {
    super(props);
    this.fetchTerm = this.fetchTerm.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.nextRound = this.nextRound.bind(this);
    this.postTeamTerm = this.postTeamTerm.bind(this);
    this.readyForNextScreen = this.readyForNextScreen.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.setWait = this.setWait.bind(this);
    this.startGame = this.startGame.bind(this);
    this.updateType = this.updateType.bind(this);
    this.state = {
      data: {},
      gameOver: false,
      landing: true,
      loaded: false,
      points: { team1: 0, team2: 0 },
      ready: 0,
      red: true,
      round: 0,
      team: 'no team',
      term: '',
      type: Types.Point,
      waiting: false
    };
  }

  public componentDidMount() {
    const endpoint = 'http://localhost:3001';
    this.socket = io(endpoint);

    this.socket.on('allReady', () => {
      this.setWait(false);
    });

    this.socket.on('data', (data: any) => {
      this.setState({ data, loaded: true });
    });

    this.socket.on('gameOver', () => {
      this.setState({ gameOver: true });
    });

    this.socket.on('points', (points: IPoints) => {
      this.setState({ points });
    });

    this.socket.on('readyOnServer', (ready: number) =>
      this.setState({ ready })
    );

    this.socket.on('round', (round: number) => {
      this.setState({ round });
    });

    this.socket.on('start', () => {
      this.setState({ landing: false });
    });

    this.socket.on('team', (team: string) => {
      this.setState({ team });
    });

    this.socket.on('term', (term: string) => {
      this.setState({ term });
    });
  }

  public startGame = () => {
    this.fetchTerm();
    this.socket.emit('start');
  };

  public fetchTerm = () => {
    this.socket.emit('points');
    this.socket.emit('term');
  };

  public joinRoom(name: string) {
    this.socket.emit('room', name);
    this.readyForNextScreen();
  }

  public readyForNextScreen() {
    this.socket.emit('ready', false);
  }

  public postTeamTerm = (team: string, term: string) => {
    return fetch(`http://localhost:3001/term?team=${team}&searchTerm=${term}`, {
      headers: { 'Content-Type': 'text/html' },
      method: 'POST'
    });
  };

  public updateType = () => {
    switch (this.state.type) {
      case Types.Search:
        this.fetchData();
        this.setState({ ready: 0, type: Types.Trend });
        break;
      case Types.Trend:
        this.fetchTerm();
        this.setState((prevState: IAppState) => ({
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

  public fetchData() {
    this.socket.emit('data');
  }

  public nextRound() {
    this.readyForNextScreen();
    this.updateType();
  }

  public setWait(state: boolean) {
    this.setState({ waiting: state });
  }

  public restartGame() {
    this.startGame();
    this.setState({
      data: {},
      gameOver: false,
      points: { team1: 0, team2: 0 },
      ready: 0,
      red: true,
      round: 0,
      term: '',
      type: Types.Point
    });
  }

  public render() {
    return (
      <div className="container">
        {this.state.landing ? (
          <Landing startGame={this.startGame} joinRoom={this.joinRoom} />
        ) : (
          <>
            {this.state.gameOver ? (
              <EndScreen restartGame={this.restartGame} />
            ) : (
              <>
                <Team
                  buttonColor="blue"
                  className="full-width visible"
                  color="red"
                  data={this.state.data}
                  loaded={this.state.loaded}
                  nextRound={this.nextRound}
                  points={this.state.points[this.state.team]}
                  postTeamTerm={this.postTeamTerm}
                  ready={this.state.ready}
                  round={this.state.round}
                  setWait={this.setWait}
                  team={this.state.team}
                  term={this.state.term}
                  type={this.state.type}
                  waiting={this.state.waiting}
                />
              </>
            )}
          </>
        )}
      </div>
    );
  }
}

export default App;
