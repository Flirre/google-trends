import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Team from './Team';

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.switch = this.switch.bind(this);
    this.fullscreenToggle = this.fullscreenToggle.bind(this);
    this.state = {
      fullscreen: false,
      red: true
    };
  }

  public switch() {
    this.setState({ red: !this.state.red });
  }

  public fullscreenToggle() {
    this.setState({ fullscreen: !this.state.fullscreen });
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
        />
      </div>
    );
  }
}

export default App;
