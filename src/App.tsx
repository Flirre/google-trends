import * as React from "react";
import "semantic-ui-css/semantic.min.css";
import { Button, Grid } from "semantic-ui-react";
import "./App.css";
import Team from "./Team";

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.switch = this.switch.bind(this);
    this.incrementTeam1 = this.incrementTeam1.bind(this);
    this.incrementTeam2 = this.incrementTeam2.bind(this);
    this.fullscreenToggle = this.fullscreenToggle.bind(this);
    this.state = { red: true, team1: 0, team2: 0, fullscreen: false };
  }

  public switch() {
    this.setState({ red: !this.state.red });
  }

  public incrementTeam1() {
    this.setState((prevState: any, props: any) => ({
      team1: prevState.team1 + Math.floor(Math.random() * 100)
    }));
  }

  public incrementTeam2() {
    this.setState((prevState: any, props: any) => ({
      team2: prevState.team2 + Math.floor(Math.random() * 100)
    }));
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
          teamName="Team 1"
          switch={this.switch}
          points={this.state.team1}
          increment={this.incrementTeam1}
          fullscreen={this.state.fullscreen}
          fullscreenToggle={this.fullscreenToggle}
        />
      ) : (
        <Team
          className="container"
          color="blue"
          buttonColor="red"
          teamName="Team 2"
          switch={this.switch}
          points={this.state.team2}
          increment={this.incrementTeam2}
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
              teamName="TEAM 1"
              switch={this.switch}
              points={this.state.team1}
              increment={this.incrementTeam1}
            />
          </Grid.Column>

          <Grid.Column className="no-pad">
            <Team
              color="blue"
              buttonColor="red"
              teamName="TEAM 2"
              switch={this.switch}
              points={this.state.team2}
              increment={this.incrementTeam2}
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
