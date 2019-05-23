import * as React from 'react';
// tslint:disable:no-console
class EndScreen extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  public componentDidMount() {
    fetch('http://localhost:3001/end')
      .then(rawWinner => {
        return rawWinner.json();
      })
      .then(winner => {
        this.setState({ winner: winner.winner });
      });
  }

  public render() {
    return (
      <div className="gameOver">
        <h1>{this.state.winner} is the winning team!</h1>
      </div>
    );
  }
}

export default EndScreen;
