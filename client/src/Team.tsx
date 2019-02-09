import * as React from 'react';
import { Button, Input } from 'semantic-ui-react';
import Chart from './Chart';

enum Types {
  Point,
  Search,
  Trend
}

class Team extends React.Component<any, any> {
  public static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (
      nextProps.type !== prevState.prevProps.type &&
      nextProps.round === prevState.prevProps.round
    ) {
      return {
        prevProps: nextProps,
        ready: false
      };
    } else if (nextProps.round > prevState.prevProps.round) {
      return {
        inputSearchTerm: '',
        prevProps: nextProps,
        ready: false,
        searchTerm: ''
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
      error: false,
      inputSearchTerm: '',
      loaded: false,
      name: `Team ${this.props.color}`,
      prevProps: props,
      ready: false,
      score: 0,
      searchTerm: ''
    };
  }

  public componentDidUpdate(prevProps: any, prevState: any) {
    if (
      prevProps !== this.props &&
      this.props.round === 1 &&
      this.state.name === `Team ${this.props.color}`
    ) {
      this.setName(`Team ${prevProps.term} ${prevState.searchTerm}`);
      this.setState({ score: 0 });
    }
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

  public updateSearchTerm = () => {
    this.setState({ searchTerm: this.state.inputSearchTerm }, () => {
      this.props
        .postTeamTerm(this.props.team, this.state.searchTerm) // this.state.name
        .then(() => {
          this.signalReady();
        });
    });
  };

  public keyPress = (e: any) => {
    if (e.keyCode === 13) {
      this.updateSearchTerm();
    }
  };

  public signalReady() {
    if (this.props.type === Types.Search && this.state.searchTerm === '') {
      return;
    }
    if (!this.state.ready) {
      this.props.nextRound();
      this.setState({ ready: true });
    }
  }

  public render() {
    return (
      <div className={`${this.props.color} player ${this.props.className}`}>
        <h2 className="round">TERM {this.props.term.toUpperCase()}</h2>
        {!(this.props.type === Types.Search) ? (
          <Button
            className="next"
            disabled={this.state.ready}
            onClick={this.signalReady}
            content=">"
          />
        ) : null}
        {this.props.type === Types.Point ? (
          <React.Fragment>
            <div className="teamContainer">
              <div className="top left">
                <Button
                  size="mini"
                  floated="left"
                  className={this.props.buttonColor}
                  content="Switch"
                  onClick={this.props.switch}
                />
              </div>
              <div className="top right">
                <Button
                  size="mini"
                  floated="right"
                  className={this.props.buttonColor}
                  content="Increment"
                  onClick={this.incrementScore}
                />
              </div>
              <div className="middle center">
                <h1 className="teamName">{this.state.name.toUpperCase()}</h1>

                <h2>{this.state.score} POINTS</h2>
              </div>
              <Button
                className="fullscreen-toggle"
                fluid={true}
                color="grey"
                size="mini"
                content="Fullscreen toggle"
                onClick={this.props.fullscreenToggle}
              />
            </div>
          </React.Fragment>
        ) : null}
        {this.props.type === Types.Search ? (
          <React.Fragment>
            <div className="chart-container">
              <div className="input">
                <Input
                  action={
                    <Button
                      icon="search"
                      disabled={this.state.ready}
                      onClick={this.updateSearchTerm}
                    />
                  }
                  placeholder="Enter a search term"
                  onChange={this.onInputChange}
                  onKeyDown={this.keyPress}
                />
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
        ) : null}
        {this.props.type === Types.Trend ? (
          <React.Fragment>
            <div className="chart-container">
              <div className="chart">
                <Chart
                  data={this.props.data}
                  color={this.props.color}
                  loaded={this.state.loaded}
                  team={this.props.team}
                  term={this.props.term}
                />
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
        ) : null}
      </div>
    );
  }
}

export default Team;
