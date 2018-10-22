import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Grid } from 'semantic-ui-react';
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
    return this.state.fullscreen ? (
      this.state.red ? (
        <Team
          className="container"
          color="red"
          buttonColor="blue"
          switch={this.switch}
          fullscreen={this.state.fullscreen}
          fullscreenToggle={this.fullscreenToggle}
        />
      ) : (
        <Team
          className="container"
          color="blue"
          buttonColor="red"
          switch={this.switch}
          fullscreen={this.state.fullscreen}
          fullscreenToggle={this.fullscreenToggle}
        />
      )
    ) : (
      <div className="container">
        <Grid columns={2}>
          <Grid.Column className="no-pad">
            <Team color="red" buttonColor="blue" switch={this.switch} />
          </Grid.Column>

          <Grid.Column className="no-pad">
            <Team color="blue" buttonColor="red" switch={this.switch} />
          </Grid.Column>
        </Grid>
        <Button
          id="fullscreen"
          fluid={true}
          color="grey"
          size="mini"
          content="Fullscreen toggle"
          attached="bottom"
          onClick={this.fullscreenToggle}
        />
      </div>
    );
  }
}

export default App;
