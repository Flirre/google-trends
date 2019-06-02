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
    this.state = {
      count: false,
      data: {},
      fullscreen: true,
      gameOver: false,
      landing: true,
      points: {},
      ready: false,
      red: true,
      round: 0,
      term: '',
      type: Types.Point
    };
  }

  public componentDidMount() {
    const endpoint = 'http://localhost:3001';
    this.socket = io(endpoint);
    this.socket.on('increment', (data: number) =>
      this.setState({ count: data })
    );
    this.socket.on('ready', () => this.setState({ ready: true }));
    this.socket.on('notReady', () => this.setState({ ready: false }));
    this.socket.on('message', (message: string) => this.setState({ message }));
  }

  public joinRoom(name: string) {
    this.socket.emit('room', name);
  }

  public startGame = () => {
    fetch(`http://localhost:3001/start`).then(() => {
      this.fetchTerm();
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
          gameOver: jsonTerm.gameOver,
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
      ready: false,
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
                  points={this.state.points.team1}
                  round={this.state.round}
                  type={this.state.type}
                  term={this.state.term}
                  team="team1"
                  nextRound={this.nextRound}
                  postTeamTerm={this.postTeamTerm}
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
