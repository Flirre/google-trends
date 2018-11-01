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
    this.setName = this.setName.bind(this);
    this.state = {
      data: [],
      error: false,
      inputSearchTerm: '',
      loaded: false,
      name: `Team ${this.props.color}`,
      score: 0,
      searchTerm: '',
      type: Types.Search
    };
  }

  public incrementScore() {
    this.setState((prevState: any, props: any) => ({
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

  public updateSearchTerm = (e: any) => {
    this.setState({ searchTerm: this.state.inputSearchTerm }, () => {
      this.fetchData();
    });
  };

  public fetchData() {
    this.setState({ loaded: false });
    /* tslint:disable */
    console.log('gogo');
    fetch(`http://localhost:3001/?searchTerm=${this.state.searchTerm}`)
      .then(results => {
        return results.json();
      })
      .then(jsonResults => {
        jsonResults.message[0]['error'] === 'error'
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
    /* tslint:enable */
  }

  public render() {
    const isPoint = this.state.type === Types.Point;
    return (
      <div className={`${this.props.color} player ${this.props.className}`}>
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
