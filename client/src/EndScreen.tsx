import * as React from 'react';
import { Button } from 'semantic-ui-react';
import './EndScreen.css';
// tslint:disable:no-console
class EndScreen extends React.Component<
  {
    restartGame: () => void;
    winner: string;
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
    return (
      <div className="end-screen">
        <h1 className="end-text">{this.props.winner} is the winning team!</h1>
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
