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
  public static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (nextProps.round > prevState.prevProps.round) {
      return {
        prevProps: nextProps,
        ready: false
      };
    }
    return null;
  }

  constructor(props: any) {
    super(props);
    this.incrementScore = this.incrementScore.bind(this);
    this.setName = this.setName.bind(this);
    this.signalReady = this.signalReady.bind(this);
    this.state = {
      data: [],
      error: false,
      inputSearchTerm: '',
      loaded: false,
      name: `Team ${this.props.color}`,
      prevProps: props,
      ready: false,
      score: 0,
      searchTerm: '',
      type: Types.Search
    };
  }

  public incrementScore() {
    this.setState((prevState: any) => ({
      score: prevState.score + Math.floor(Math.random() * 100)
    }));
  }

  public setName(newName: string) {
    this.setState({ name: newName });
  }

  public onInputChange = (e: any) => {
    this.setState({ inputSearchTerm: e.target.value });
  };

  public keyPress = (e: any) => {
    if (e.keyCode === 13) {
      this.setState({ searchTerm: this.state.inputSearchTerm });
    }
  };

  public updateSearchTerm = () => {
    this.setState({ searchTerm: this.state.inputSearchTerm }, () => {
      this.fetchData();
    });
  };

  public updateType = () => {
    switch (this.state.type) {
      case Types.Search:
        this.setState({ type: Types.Trend });
        break;
      case Types.Trend:
        this.setState({ type: Types.Point });
        break;
      case Types.Point:
        this.setState({ type: Types.Search });
        break;
    }
  };

  public signalReady() {
    if (!this.state.ready) {
      this.props.nextRound();
      this.setState({ ready: true });
    }
  }

  public fetchData() {
    this.setState({ loaded: false });
    fetch(`http://localhost:3001/?searchTerm=${this.state.searchTerm}`)
      .then(results => {
        return results.json();
      })
      .then(jsonResults => {
        jsonResults.message[0].error === 'error'
          ? this.setState({ error: true, loaded: false })
          : this.setState((prevState: any) => ({
              data: jsonResults,
              error: false,
              loaded: true,
              score:
                prevState.score +
                jsonResults.message[jsonResults.message.length - 1][
                  this.state.searchTerm
                ]
            }));
      });
  }

  public render() {
    const isPoint = this.state.type === Types.Point;
    return (
      <div className={`${this.props.color} player ${this.props.className}`}>
        <h2 className="round">TERM {this.props.round}</h2>
        <Button className="next" onClick={this.updateType} content=">" />
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
                  <div>
                    <div>
                      <h1 className="teamName">
                        {this.state.name.toUpperCase()}
                      </h1>
                    </div>
                    <h2>{this.state.score} POINTS</h2>
                  </div>
                </Grid.Column>
                <Grid.Column />
              </Grid.Row>
              <Grid.Row verticalAlign="bottom" />
            </Grid>
            <Button
              className="fullscreen-toggle"
              fluid={true}
              color="grey"
              size="mini"
              content="Fullscreen toggle"
              onClick={this.props.fullscreenToggle}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="chart-container">
              <div className="chart">
                <Chart
                  data={this.state.data}
                  searchTerm={this.state.searchTerm}
                  color={this.props.color}
                  loaded={this.state.loaded}
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
              className="fullscreen-toggle"
              fluid={true}
              color="grey"
              size="mini"
              content="Fullscreen toggle"
              onClick={this.props.fullscreenToggle}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Team;
