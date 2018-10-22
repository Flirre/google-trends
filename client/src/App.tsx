import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Grid } from 'semantic-ui-react';
import './App.css';
import Team from './Team';

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.switch = this.switch.bind(this);
    this.setTeam1Name = this.setTeam1Name.bind(this);
    this.setTeam2Name = this.setTeam2Name.bind(this);
    this.fullscreenToggle = this.fullscreenToggle.bind(this);
    this.state = {
      data: null,
      fullscreen: false,
      red: true,
      team1Name: '1',
      team2Name: '2'
    };
  }

  public switch() {
    this.setState({ red: !this.state.red });
  }

  public setTeam1Name(name: string) {
    this.setState({ team1Name: name });
  }

  public setTeam2Name(name: string) {
    this.setState({ team2Name: name });
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
          teamName={'TEAM ' + this.state.team1Name.toUpperCase()}
          switch={this.switch}
          fullscreen={this.state.fullscreen}
          fullscreenToggle={this.fullscreenToggle}
        />
      ) : (
        <Team
          className="container"
          color="blue"
          buttonColor="red"
          teamName={'TEAM ' + this.state.team2Name.toUpperCase()}
          switch={this.switch}
          fullscreen={this.state.fullscreen}
          fullscreenToggle={this.fullscreenToggle}
        />
      )
    ) : (
      <div className="container">
        <Grid columns={2}>
          <Grid.Column className="no-pad">
            <Team
              color="red"
              buttonColor="blue"
              teamName={'TEAM ' + this.state.team1Name.toUpperCase()}
              switch={this.switch}
            />
          </Grid.Column>

          <Grid.Column className="no-pad">
            <Team
              color="blue"
              buttonColor="red"
              teamName={'TEAM ' + this.state.team2Name.toUpperCase()}
              switch={this.switch}
            />
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
