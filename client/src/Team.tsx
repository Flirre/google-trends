import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Grid, Input } from 'semantic-ui-react';
import Chart from './Chart';

enum Types {
  Point,
  Search,
  Trend
}

class Team extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.incrementScore = this.incrementScore.bind(this);
    this.state = {
      inputSearchTerm: '',
      score: 0,
      searchTerm: '',
      type: Types.Point
    };
  }

  public incrementScore() {
    this.setState((prevState: any, props: any) => ({
      score: prevState.score + Math.floor(Math.random() * 100)
    }));
  }

  public onInputChange = (e: any) => {
    this.setState({ inputSearchTerm: e.target.value });
  };

  public keyPress = (e: any) => {
    if (e.keyCode === 13) {
      this.setState({ searchTerm: this.state.inputSearchTerm });
    }
  };

  public updateSearchTerm = (e: any) => {
    this.setState({ searchTerm: this.state.inputSearchTerm });
  };

  public render() {
    const isPoint = this.state.type === Types.Point;
    return (
      <div
        className={`${this.props.color} ${this.props.className || 'shared'}`}
      >
        {isPoint ? (
          <React.Fragment>
            <Grid rows={3} columns={3} textAlign="center">
              <Grid.Row verticalAlign="top">
                <Grid.Column>
                  <Button
                    size="mini"
                    floated="left"
                    className={this.props.buttonColor}
                    content="Switch"
                    onClick={this.props.switch}
                  />
                </Grid.Column>
                <Grid.Column />
                <Grid.Column>
                  <Button
                    size="mini"
                    floated="right"
                    className={this.props.buttonColor}
                    content="Increment"
                    onClick={this.incrementScore}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row verticalAlign="middle">
                <Grid.Column />
                <Grid.Column textAlign="center">
                  <div className="content">
                    <div
                      className={`shadow ${
                        this.props.fullscreen ? 'team-fullscreen' : 'team'
                      }`}
                    >
                      <h1>{this.props.teamName}</h1>
                    </div>
                    <h2 className="shadowtext">{this.state.score} POINTS</h2>
                  </div>
                </Grid.Column>
                <Grid.Column />
              </Grid.Row>
              <Grid.Row verticalAlign="bottom" />
            </Grid>
            <Button
              id="fullscreen"
              fluid={true}
              color="grey"
              size="mini"
              content="Fullscreen toggle"
              attached="bottom"
              onClick={this.props.fullscreenToggle}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="chart-container">
              <div className="chart">
                <Chart
                  searchTerm={this.state.searchTerm}
                  color={this.props.color}
                />
                <div className="input">
                  <Input
                    action={
                      <Button icon="search" onClick={this.updateSearchTerm} />
                    }
                    placeholder="Enter a search term"
                    onChange={this.onInputChange}
                    onKeyDown={this.keyPress}
                  />
                </div>
              </div>
            </div>
            <Button
              id="fullscreen"
              fluid={true}
              color="grey"
              size="mini"
              content="Fullscreen toggle"
              attached="bottom"
              onClick={this.props.fullscreenToggle}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Team;
