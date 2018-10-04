import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Grid } from 'semantic-ui-react';
import './App.css';
import Team from './Team';

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.switch = this.switch.bind(this);
    this.incrementTeam1 = this.incrementTeam1.bind(this);
    this.incrementTeam2 = this.incrementTeam2.bind(this);
    this.setTeam1Name = this.setTeam1Name.bind(this);
    this.setTeam2Name = this.setTeam2Name.bind(this);
    this.fullscreenToggle = this.fullscreenToggle.bind(this);
    this.state = {
      data: null,
      fullscreen: false,
      red: true,
      team1Name: '1',
      team1Points: 0,
      team2Name: '2',
      team2Points: 0
    };
  }

  public switch() {
    this.setState({ red: !this.state.red });
  }

  public incrementTeam1() {
    this.setState((prevState: any, props: any) => ({
      team1Points: prevState.team1Points + Math.floor(Math.random() * 100)
    }));
  }

  public incrementTeam2() {
    this.setState((prevState: any, props: any) => ({
      team2Points: prevState.team2Points + Math.floor(Math.random() * 100)
    }));
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

  public componentDidMount() {
    /* tslint:disable */
    fetch('http://localhost:3001')
      .then(results => {
        return results.json();
      })
      .then(jsonResults => {
        this.setState({ data: jsonResults });
      });
    /* tslint:enable */
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
          points={this.state.team1Points}
          increment={this.incrementTeam1}
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
          points={this.state.team2Points}
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
              teamName={'TEAM ' + this.state.team1Name.toUpperCase()}
              switch={this.switch}
              points={this.state.team1Points}
              increment={this.incrementTeam1}
            />
          </Grid.Column>

          <Grid.Column className="no-pad">
            <Team
              color="blue"
              buttonColor="red"
              teamName={'TEAM ' + this.state.team2Name.toUpperCase()}
              switch={this.switch}
              points={this.state.team2Points}
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
