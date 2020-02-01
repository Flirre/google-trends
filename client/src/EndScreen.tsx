import * as React from 'react';
import { Button } from 'semantic-ui-react';
import './EndScreen.css';
// tslint:disable:no-console
class EndScreen extends React.Component<
  {
    restartGame: () => void;
    winner: string;
    points: { team1: number; team2: number };
  },
  any
> {
  constructor(props: any) {
    super(props);
    this.state = {};
    this.restart = this.restart.bind(this);
  }

  public restart() {
    this.props.restartGame();
  }

  public render() {
    let winningText = 'Calculating winner..';
    if (this.props.winner === 'DRAW') {
      winningText = 'Draw! <br> Both teams got the same amount of points.';
    }
    if (this.props.winner !== 'DRAW' && this.props.winner !== '') {
      winningText = `${this.props.winner} is the winning team!`;
    }
    return (
      <div className="end-screen">
        <h1 className="end-text">{winningText}</h1>
        <h2>team1: {this.props.points.team1}</h2>
        <h2>team2: {this.props.points.team2}</h2>
        <Button
          className="end-button"
          content="Restart"
          size="huge"
          basic={true}
          color="grey"
          inverted={true}
          onClick={this.restart}
        />
      </div>
    );
  }
}

export default EndScreen;
