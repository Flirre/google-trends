import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Team from './Team';

enum Types {
  Point,
  Search,
  Trend
}

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.switch = this.switch.bind(this);
    this.fullscreenToggle = this.fullscreenToggle.bind(this);
    this.nextRound = this.nextRound.bind(this);
    this.updateType = this.updateType.bind(this);
    this.state = {
      fullscreen: false,
      ready: 0,
      red: true,
      round: 0,
      type: Types.Point
    };
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
        this.setState({ ready: 0, type: Types.Trend });
        break;
      case Types.Trend:
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
        <Team
          className={
            this.state.fullscreen
              ? 'full-width ' + (this.state.red ? 'visible' : 'hidden')
              : 'half-width'
          }
          color="red"
          buttonColor="blue"
          switch={this.switch}
          fullscreen={this.state.fullscreen}
          fullscreenToggle={this.fullscreenToggle}
          round={this.state.round}
          type={this.state.type}
          nextRound={this.nextRound}
        />
        <Team
          className={
            this.state.fullscreen
              ? 'full-width ' + (!this.state.red ? 'visible' : 'hidden')
              : 'half-width'
          }
          color="blue"
          buttonColor="red"
          switch={this.switch}
          fullscreen={this.state.fullscreen}
          fullscreenToggle={this.fullscreenToggle}
          round={this.state.round}
          type={this.state.type}
          nextRound={this.nextRound}
        />
      </div>
    );
  }
}

export default App;
