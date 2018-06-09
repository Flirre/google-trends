import * as React from "react";
import "semantic-ui-css/semantic.min.css";
import { Button, Grid } from "semantic-ui-react";

class Team extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div
        className={`${this.props.color} ${this.props.className || "shared"}`}
      >
        <Grid rows={3} columns={3} textAlign="center">
          <Grid.Row verticalAlign="top">
            <Grid.Column>
              <Button
                size="mini"
                floated="left"
                color={this.props.buttonColor}
                content="Switch"
                onClick={this.props.switch}
              />
            </Grid.Column>
            <Grid.Column />
            <Grid.Column>
              <Button
                size="mini"
                floated="right"
                color={this.props.buttonColor}
                content="Increment"
                onClick={this.props.increment}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row verticalAlign="middle">
            <Grid.Column />
            <Grid.Column textAlign="center">
              <div className="content">
                <h1>{this.props.teamName}</h1>
                <h2>
                  Points:
                  <p id="points">{this.props.points}</p>
                </h2>
              </div>
            </Grid.Column>
            <Grid.Column />
          </Grid.Row>
          <Grid.Row verticalAlign="bottom" />
        </Grid>
        <Button
          id="fullscreen"
          fluid={true}
          primary={true}
          size="mini"
          content="Fullscreen toggle"
          attached="bottom"
          onClick={this.props.fullscreenToggle}
        />
      </div>
    );
  }

  public log() {
    // tslint:disable-next-line:no-console
    console.log("switch");
  }
}

export default Team;
