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

class App extends React.Component<any, any> {
  public socket: SocketIOClient.Socket;

  constructor(props: any) {
    super(props);
    this.startGame = this.startGame.bind(this);
    this.switch = this.switch.bind(this);
    this.fetchTerm = this.fetchTerm.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.postTeamTerm = this.postTeamTerm.bind(this);
    this.fullscreenToggle = this.fullscreenToggle.bind(this);
    this.nextRound = this.nextRound.bind(this);
    this.updateType = this.updateType.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.readyForNextScreen = this.readyForNextScreen.bind(this);
    this.setWait = this.setWait.bind(this);
    this.state = {
      count: false,
      data: {},
      fullscreen: true,
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
    this.socket.on('increment', (data: number) =>
      this.setState({ count: data })
    );
    this.socket.on('readyOnServer', (ready: number) =>
      this.setState({ ready })
    );
    this.socket.on('message', (message: string) => this.setState({ message }));
    this.socket.on('team', (team: string) => this.setState({ team }));
    this.socket.on('points', (points: any) => {
      this.setState({ points });
    });
    this.socket.on('data', (data: any) => {
      this.setState({ data, loaded: true });
    });
    this.socket.on('term', (term: string) => {
      this.setState({ term });
    });
    this.socket.on('round', (round: number) => {
      this.setState({ round });
    });
    this.socket.on('gameOver', () => {
      this.setState({ gameOver: true });
    });
    this.socket.on('allReady', () => {
      this.setWait(false);
    });
  }

  public joinRoom(name: string) {
    this.socket.emit('room', name);
    this.socket.emit('ready', false);
  }

  public readyForNextScreen() {
    this.socket.emit('ready', false);
  }

  public startGame = () => {
    fetch(`http://localhost:3001/start`).then(() => {
      this.fetchTerm();
      this.setState({ landing: false });
    });
  };

  public fetchTerm = () => {
    this.socket.emit('points');
    this.socket.emit('term');
  };

  public postTeamTerm = (team: string, term: string) => {
    return fetch(`http://localhost:3001/term?team=${team}&searchTerm=${term}`, {
      headers: { 'Content-Type': 'text/html' },
      method: 'POST'
    });
  };

  public fetchData() {
    this.socket.emit('data');
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
    this.readyForNextScreen();
    this.updateType();
  }

  public restartGame() {
    this.startGame();
    this.setState({
      count: false,
      data: {},
      fullscreen: true,
      gameOver: false,
      points: {},
      ready: 0,
      red: true,
      round: 0,
      term: '',
      type: Types.Point
    });
  }

  public setWait(state: boolean) {
    this.setState({ waiting: state });
  }

  public render() {
    return (
      <div className="container">
        {this.state.landing ? (
          <Landing
            startGame={this.startGame}
            message={this.state.message}
            num={this.state.count}
            joinRoom={this.joinRoom}
          />
        ) : (
          <>
            {this.state.gameOver ? (
              <EndScreen restartGame={this.restartGame} />
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
                  loaded={this.state.loaded}
                  points={this.state.points[this.state.team]}
                  round={this.state.round}
                  ready={this.state.ready}
                  type={this.state.type}
                  term={this.state.term}
                  team={this.state.team}
                  nextRound={this.nextRound}
                  postTeamTerm={this.postTeamTerm}
                  waiting={this.state.waiting}
                  setWait={this.setWait}
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
